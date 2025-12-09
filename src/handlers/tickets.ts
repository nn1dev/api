import { Hono } from "hono";
import { Resend } from "resend";
import z from "zod";
import * as Sentry from "@sentry/cloudflare";
import { renderEmailSignupSuccess } from "../../emails/signup-success";
import { renderEmailAdminSignupSuccess } from "../../emails/admin-signup-success";
import { renderEmailSignupConfirm } from "../../emails/signup-confirm";
import { renderEmailAdminSignupCancel } from "../../emails/admin-signup-cancel";
import auth from "../middlewares/auth";

const app = new Hono<{
  Bindings: Cloudflare.Env;
  Variables: { db: D1Database };
}>();

app.use(auth);
app.use("*", async (c, next) => {
  c.set("db", Sentry.instrumentD1WithSentry(c.env.DB));
  await next();
});

app.get("/", async (c) => {
  const db = c.get("db");

  const { results } = await db.prepare(`select * from tickets`).all<Ticket>();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:eventId", async (c) => {
  const db = c.get("db");
  const { eventId } = c.req.param();

  const { results } = await db
    .prepare(`select * from tickets where event_id = ?`)
    .bind(eventId)
    .all<Ticket>();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:eventId/:ticketId", async (c) => {
  const db = c.get("db");
  const { eventId, ticketId } = c.req.param();

  const ticket = await db
    .prepare(`select * from tickets where event_id = ? and id = ?`)
    .bind(eventId, ticketId)
    .first<Ticket>();

  if (!ticket) {
    return c.json(
      {
        status: "error",
        data: `Ticket not found.`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: ticket,
    },
    200,
  );
});

const TicketsPostBodySchema = z.object({
  name: z.string().trim(),
  email: z.email().toLowerCase(),
  eventId: z.number(),
  eventName: z.string(),
  eventDate: z.string(),
  eventLocation: z.string(),
  eventInviteUrlIcal: z.string(),
  eventInviteUrlGoogle: z.string(),
  subscribe: z.boolean(),
});

app.post("/", async (c) => {
  const db = c.get("db");
  const body = TicketsPostBodySchema.safeParse(await c.req.json());

  if (!body.success) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data.",
      },
      400,
    );
  }

  const {
    name,
    email,
    eventId,
    eventName,
    eventDate,
    eventLocation,
    eventInviteUrlIcal,
    eventInviteUrlGoogle,
    subscribe,
  } = body.data;

  const existingTicket = await db
    .prepare(`select * from tickets where event_id = ? and email = ?`)
    .bind(eventId, email)
    .first<Ticket>();

  if (existingTicket) {
    return c.json(
      {
        status: "success",
        data: existingTicket,
      },
      200,
    );
  }

  const emailPreviouslyConfirmed = await db
    .prepare(`select * from tickets where email = ? and confirmed = ?`)
    .bind(email, 1)
    .first<Ticket>();

  const resend = new Resend(c.env.API_KEY_RESEND);

  if (emailPreviouslyConfirmed) {
    const newTicketId = crypto.randomUUID();
    const [_, newTicketResult] = await db.batch<Ticket>([
      db
        .prepare(
          `insert into tickets (id, event_id, email, name, confirmed, confirmation_token, subscribe) values (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(newTicketId, eventId, email, name, 1, null, subscribe),
      db.prepare(`select * from tickets where id = ?`).bind(newTicketId),
    ]);

    if (!newTicketResult.results.length) {
      return c.json(
        {
          status: "error",
          data: `Ticket not found.`,
        },
        404,
      );
    }
    const newTicket = newTicketResult.results[0];

    const [emailUser, emailAdmin] = await Promise.all([
      renderEmailSignupSuccess({
        ticketUrl: `${c.env.URL_CLIENT}/events/${eventId}/${newTicketId}`,
        eventName: eventName,
        eventDate: eventDate,
        eventLocation: eventLocation,
        eventInviteUrlIcal: eventInviteUrlIcal,
        eventInviteUrlGoogle: eventInviteUrlGoogle,
      }),
      renderEmailAdminSignupSuccess({
        name,
        email,
      }),
    ]);
    const [emailUserResponse, emailAdminResponse] = await Promise.all([
      resend.emails.send({
        from: "NN1 Dev Club <club@nn1.dev>",
        to: email,
        subject: eventName,
        html: emailUser.html,
        text: emailUser.text,
      }),
      resend.emails.send({
        from: "NN1 Dev Club <club@nn1.dev>",
        to: c.env.ADMIN_EMAILS.split(","),
        subject: "✨ New signup",
        html: emailAdmin.html,
        text: emailAdmin.text,
      }),
    ]);

    if (emailUserResponse.error || emailAdminResponse.error) {
      return c.json(
        {
          status: "error",
          data: emailUserResponse.error || emailAdminResponse.error,
        },
        400,
      );
    }

    if (subscribe) {
      const subscriber = await db
        .prepare(`select * from subscribers where email = ?`)
        .bind(email)
        .first<Subscriber>();

      if (subscriber && !subscriber.confirmed) {
        await db
          .prepare(
            `update subscribers set confirmed = ?, confirmation_token = ? where email = ?`,
          )
          .bind(1, null, email)
          .run();
      }

      if (!subscriber) {
        const newSubscriberId = crypto.randomUUID();
        await db
          .prepare(
            `insert into subscribers (id, email, confirmed, confirmation_token) values (?, ?, ?, ?)`,
          )
          .bind(newSubscriberId, email, 1, null)
          .run();
      }
    }

    return c.json(
      {
        status: "success",
        data: newTicket,
      },
      201,
    );
  }

  const id = crypto.randomUUID();
  const confirmation_token = crypto.randomUUID();

  const [_, ticketsResult] = await db.batch<Ticket>([
    db
      .prepare(
        `insert into tickets (id, event_id, email, name, confirmed,  confirmation_token, subscribe ) values (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, eventId, email, name, 0, confirmation_token, subscribe),
    db.prepare(`select * from tickets where id = ?`).bind(id),
  ]);

  if (!ticketsResult.results.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket not found.`,
      },
      404,
    );
  }

  const ticket = ticketsResult.results[0];

  const emailTemplate = await renderEmailSignupConfirm({
    eventName: eventName,
    url: `${c.env.URL_CLIENT}/events/${eventId}/${id}/${confirmation_token}`,
  });

  const { error } = await resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: email,
    subject: "Confirm your email please",
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  if (error) {
    return c.json(
      {
        status: "error",
        data: error,
      },
      400,
    );
  }

  return c.json(
    {
      status: "success",
      data: ticket,
    },
    201,
  );
});

const TicketsPutBodySchema = z.object({
  confirmationToken: z.uuid(),
  eventName: z.string(),
  eventDate: z.string(),
  eventLocation: z.string(),
  eventInviteUrlIcal: z.string(),
  eventInviteUrlGoogle: z.string(),
});

app.put("/:eventId/:ticketId", async (c) => {
  const db = c.get("db");
  const { eventId, ticketId } = c.req.param();
  const body = TicketsPutBodySchema.safeParse(await c.req.json());

  if (!body.success) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data.",
      },
      400,
    );
  }

  const {
    confirmationToken,
    eventName,
    eventDate,
    eventLocation,
    eventInviteUrlIcal,
    eventInviteUrlGoogle,
  } = body.data;

  const ticket = await db
    .prepare(`select * from tickets where event_id = ? and id = ?`)
    .bind(eventId, ticketId)
    .first<Ticket>();

  if (!ticket || ticket.confirmation_token !== confirmationToken) {
    return c.json(
      {
        status: "error",
        data: "Invalid ticket id or confirmation token.",
      },
      400,
    );
  }

  await db
    .prepare(
      `update tickets set confirmed = ?, confirmation_token = ?  where event_id = ? and id = ?`,
    )
    .bind(1, null, eventId, ticketId)
    .run();

  const resend = new Resend(c.env.API_KEY_RESEND);

  const [emailUser, emailAdmin] = await Promise.all([
    renderEmailSignupSuccess({
      ticketUrl: `${c.env.URL_CLIENT}/events/${eventId}/${ticketId}`,
      eventName: eventName,
      eventDate: eventDate,
      eventLocation: eventLocation,
      eventInviteUrlIcal: eventInviteUrlIcal,
      eventInviteUrlGoogle: eventInviteUrlGoogle,
    }),
    renderEmailAdminSignupSuccess({
      name: ticket.name,
      email: ticket.email,
    }),
  ]);
  const [emailUserResponse, emailAdminResponse] = await Promise.all([
    resend.emails.send({
      from: "NN1 Dev Club <club@nn1.dev>",
      to: ticket.email,
      subject: eventName,
      html: emailUser.html,
      text: emailUser.text,
    }),
    resend.emails.send({
      from: "NN1 Dev Club <club@nn1.dev>",
      to: c.env.ADMIN_EMAILS.split(","),
      subject: "✨ New signup",
      html: emailAdmin.html,
      text: emailAdmin.text,
    }),
  ]);
  if (emailUserResponse.error || emailAdminResponse.error) {
    return c.json(
      {
        status: "error",
        data: emailUserResponse.error || emailAdminResponse.error,
      },
      400,
    );
  }

  if (ticket.subscribe) {
    const subscriber = await db
      .prepare(`select * from subscribers where email = ?`)
      .bind(ticket.email)
      .first<Subscriber>();

    if (subscriber && !subscriber.confirmed) {
      await db
        .prepare(
          `update subscribers set confirmed = ?, confirmation_token = ? where email = ?`,
        )
        .bind(1, null, ticket.email)
        .run();
    }

    if (!subscriber) {
      const id = crypto.randomUUID();
      await db
        .prepare(
          `insert into subscribers (id, email, confirmed, confirmation_token) values (?, ?, ?, ?)`,
        )
        .bind(id, ticket.email, 1, null)
        .run();
    }
  }

  return c.json(
    {
      status: "success",
      data: { ...ticket, confirmed: 1, confirmation_token: null },
    },
    200,
  );
});

app.delete("/:eventId/:ticketId", async (c) => {
  const db = c.get("db");
  const { eventId, ticketId } = c.req.param();

  const [ticketResult, _] = await db.batch<Ticket>([
    db
      .prepare(`select * from tickets where event_id = ? and id = ?`)
      .bind(eventId, ticketId),
    db
      .prepare(`delete from tickets where event_id = ? and id = ?`)
      .bind(eventId, ticketId),
  ]);

  if (!ticketResult.results.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket not found.`,
      },
      404,
    );
  }

  const ticket = ticketResult.results[0];

  const resend = new Resend(c.env.API_KEY_RESEND);

  const email = await renderEmailAdminSignupCancel({
    name: ticket.name,
    email: ticket.email,
  });

  const adminConfirmationError = await resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: c.env.ADMIN_EMAILS.split(","),
    subject: "Ticket cancelled 👎",
    html: email.html,
    text: email.text,
  });

  if (adminConfirmationError.error) {
    return c.json(
      {
        status: "error",
        data: adminConfirmationError.error,
      },
      400,
    );
  }

  return c.json(
    {
      status: "success",
      data: ticket,
    },
    200,
  );
});

export default app;
