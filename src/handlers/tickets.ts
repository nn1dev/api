import { Hono } from "hono";
import { Resend } from "resend";
import { normalizeEmail, normalizeName } from "../utils";
import { renderEmailSignupSuccess } from "../../emails/signup-success";
import { renderEmailAdminSignupSuccess } from "../../emails/admin-signup-success";
import { renderEmailSignupConfirm } from "../../emails/signup-confirm";
import { renderEmailAdminSignupCancel } from "../../emails/admin-signup-cancel";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(`select * from tickets`).run();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:eventId", async (c) => {
  const { eventId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ?`,
  )
    .bind(eventId)
    .run();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:eventId/:ticketId", async (c) => {
  const { eventId, ticketId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ? and id = ?`,
  )
    .bind(eventId, ticketId)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket with id ${ticketId} not found`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: results[0],
    },
    200,
  );
});

app.post("/", async (c) => {
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
  } = await c.req.json();

  // TODO: Better payload validation
  if (
    !email ||
    !name ||
    !eventId ||
    !eventName ||
    !eventDate ||
    !eventLocation ||
    !eventInviteUrlIcal ||
    !eventInviteUrlGoogle ||
    typeof subscribe !== "boolean"
  ) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data",
      },
      400,
    );
  }

  const normalizedBodyName = normalizeName(name);
  const normalizedBodyEmail = normalizeEmail(email);

  const existingTicket = await c.env.DB.prepare(
    `select * from tickets where event_id = ? and email = ?`,
  )
    .bind(eventId, normalizedBodyEmail)
    .first();

  if (existingTicket) {
    return c.json(
      {
        status: "success",
        data: existingTicket,
      },
      201,
    );
  }

  const emailPreviouslyConfirmed = await c.env.DB.prepare(
    `select * from tickets where email = ? and confirmed = ?`,
  )
    .bind(normalizedBodyEmail, true)
    .first();

  const resend = new Resend(c.env.API_KEY_RESEND);

  if (emailPreviouslyConfirmed) {
    const id = crypto.randomUUID();
    await c.env.DB.prepare(
      `insert into tickets (id, event_id, email, name, confirmed, confirmation_token, subscribe) values (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        eventId,
        normalizedBodyEmail,
        normalizedBodyName,
        true,
        "",
        subscribe,
      )
      .run();

    const [emailUser, emailAdmin] = await Promise.all([
      renderEmailSignupSuccess({
        ticketUrl: `${c.env.URL_CLIENT}/events/${eventId}/${id}`,
        eventName: eventName,
        eventDate: eventDate,
        eventLocation: eventLocation,
        eventInviteUrlIcal: eventInviteUrlIcal,
        eventInviteUrlGoogle: eventInviteUrlGoogle,
      }),
      renderEmailAdminSignupSuccess({
        name: normalizedBodyName,
        email: normalizedBodyEmail,
      }),
    ]);
    const [emailUserResponse, emailAdminResponse] = await Promise.all([
      resend.emails.send({
        from: "NN1 Dev Club <club@nn1.dev>",
        to: normalizedBodyEmail,
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
      const subscriber = await c.env.DB.prepare(
        `select * from subscribers where email = ?`,
      )
        .bind(normalizedBodyEmail)
        .first();

      if (subscriber && !subscriber.confirmed) {
        await c.env.DB.prepare(
          `update subscribers set confirmed = ?, confirmation_token = ? where email = ?`,
        )
          .bind(true, "", normalizedBodyEmail)
          .run();
      }

      if (!subscriber) {
        await c.env.DB.prepare(
          `insert into subscribers (email, confirmed) values (?, ?)`,
        )
          .bind(normalizedBodyEmail, true)
          .run();
      }
    }

    const newTicket = await c.env.DB.prepare(
      `select * from tickets where id = ?`,
    )
      .bind(id)
      .first();

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

  await c.env.DB.prepare(
    `insert into tickets (id, event_id, email, name, confirmed,  confirmation_token, subscribe ) values (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      eventId,
      normalizedBodyEmail,
      normalizedBodyName,
      false,
      confirmation_token,
      subscribe,
    )
    .run();

  const emailTemplate = await renderEmailSignupConfirm({
    eventName: eventName,
    url: `https://nn1.dev/events/${eventId}/${id}/${confirmation_token}`,
  });

  const { error } = await resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: normalizedBodyEmail,
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

  const { results } = await c.env.DB.prepare(
    `select * from tickets where id = ?`,
  )
    .bind(id)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket with id ${id} not found`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: results[0],
    },
    201,
  );
});

app.put("/:eventId/:ticketId", async (c) => {
  const { eventId, ticketId } = c.req.param();

  // TODO: Better payload validation
  const {
    confirmationToken,
    eventName,
    eventDate,
    eventLocation,
    eventInviteUrlIcal,
    eventInviteUrlGoogle,
  } = await c.req.json();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ? and id = ?`,
  )
    .bind(eventId, ticketId)
    .run();

  if (!results?.length || results[0].confirmation_token !== confirmationToken) {
    return c.json(
      {
        status: "error",
        data: "invalid ticket id or confirmation token",
      },
      404,
    );
  }

  await c.env.DB.prepare(
    `update tickets set confirmed = ?, confirmation_token = ?  where event_id = ? and id = ?`,
  )
    .bind(true, "", eventId, ticketId)
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
      name: results[0].name as string,
      email: results[0].email as string,
    }),
  ]);
  const [emailUserResponse, emailAdminResponse] = await Promise.all([
    resend.emails.send({
      from: "NN1 Dev Club <club@nn1.dev>",
      to: results[0].email as string,
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
      { status: 400 },
    );
  }

  if (results[0].subscribe) {
    console.log({ result: results[0] });
    const subscriber = await c.env.DB.prepare(
      `select * from subscribers where email = ?`,
    )
      .bind(results[0].email)
      .first();

    if (subscriber && !subscriber.confirmed) {
      await c.env.DB.prepare(
        `update subscribers set confirmed = ?, confirmation_token = ? where email = ?`,
      )
        .bind(true, "", results[0].email)
        .run();
    }

    if (!subscriber) {
      const id = crypto.randomUUID();
      await c.env.DB.prepare(
        `insert into subscribers (id, email, confirmed, confirmation_token) values (?, ?, ?, ?)`,
      )
        .bind(id, results[0].email, true, "")
        .run();
    }
  }

  return c.json(
    {
      status: "success",
      data: { ...results[0], confirmed: 1, confirmation_token: "" },
    },
    { status: 200 },
  );
});

app.delete("/:eventId/:ticketId", async (c) => {
  const { eventId, ticketId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ? and id = ?`,
  )
    .bind(eventId, ticketId)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket with id ${ticketId} not found`,
      },
      404,
    );
  }

  const resend = new Resend(c.env.API_KEY_RESEND);

  const email = await renderEmailAdminSignupCancel({
    name: results[0].name as string,
    email: results[0].email as string,
  });

  resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: c.env.ADMIN_EMAILS.split(","),
    subject: "Ticket cancelled 👎",
    html: email.html,
    text: email.text,
  });

  await c.env.DB.prepare(`delete from tickets where event_id = ? and id = ?`)
    .bind(eventId, ticketId)
    .run();

  return c.json(
    {
      status: "success",
      data: results[0],
    },
    200,
  );
});

export default app;
