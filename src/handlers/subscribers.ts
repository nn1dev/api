import { Hono } from "hono";
import { Resend } from "resend";
import z from "zod";
import { normalizeEmail } from "../utils";
import { renderEmailAdminNewsletterSubscribe } from "../../emails/admin-newsletter-subscribe";
import { renderEmailAdminNewsletterUnsubscribe } from "../../emails/admin-newsletter-unsubscribe";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `select * from subscribers`,
  ).all<Subscriber>();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .first<Subscriber>();

  if (!subscriber) {
    return c.json(
      {
        status: "error",
        data: `Subscriber with id ${subscriberId} not found.`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: subscriber,
    },
    200,
  );
});

const SubscribersPostBody = z.object({
  email: z.email().trim().toLowerCase(),
});

app.post("/", async (c) => {
  const body = SubscribersPostBody.safeParse(await c.req.json());

  if (!body.success) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data.",
      },
      400,
    );
  }

  const { data } = body;

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where email = ?`,
  )
    .bind(data.email)
    .first<Subscriber>();

  if (subscriber) {
    return c.json(
      {
        status: "success",
        data: subscriber,
      },
      201,
    );
  }

  const id = crypto.randomUUID();
  const confirmation_token = crypto.randomUUID();
  await c.env.DB.prepare(
    `insert into subscribers (id, email, confirmed, confirmation_token) values (?, ?, ?, ?)`,
  )
    .bind(id, data.email, 0, confirmation_token)
    .run();

  const newSubscriber = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(id)
    .first<Subscriber>();

  if (!newSubscriber) {
    return c.json(
      {
        status: "error",
        data: `Subscriber with id ${id} not found.`,
      },
      404,
    );
  }

  // here we should send an email to confirm a subscription,
  // we dont have a template for it now, nor we have a support for it on the
  // frontend so this one can wait
  //
  // const resend = new Resend(c.env.API_KEY_RESEND);
  //
  // const emailAdmin = await renderEmailAdminNewsletterSubscribe({
  //   email: normalizedBodyEmail,
  // });
  //
  // const { error } = await resend.emails.send({
  //   from: "NN1 Dev Club <club@nn1.dev>",
  //   to: c.env.ADMIN_EMAILS.split(","),
  //   subject: "✨ Newsletter - user subscribed",
  //   html: emailAdmin.html,
  //   text: emailAdmin.text,
  // });
  //
  // if (error) {
  //   return c.json(
  //     {
  //       status: "error",
  //       data: error,
  //     },
  //     { status: 400 },
  //   );
  // }

  return c.json(
    {
      status: "success",
      data: newSubscriber,
    },
    201,
  );
});

const SubscribersPutBody = z.object({
  confirmationToken: z.uuid(),
});

app.put("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();
  const body = SubscribersPutBody.safeParse(await c.req.json());

  if (!body.success) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data.",
      },
      400,
    );
  }

  const { data } = body;

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .first<Subscriber>();

  if (!subscriber || subscriber.confirmation_token !== data.confirmationToken) {
    return c.json(
      {
        status: "error",
        data: "Invalid subscriber id or confirmation token.",
      },
      400,
    );
  }

  await c.env.DB.prepare(
    `update subscribers set confirmed = ?, confirmation_token = ? where id = ?`,
  )
    .bind(1, null, subscriberId)
    .run();

  const resend = new Resend(c.env.API_KEY_RESEND);

  const emailAdmin = await renderEmailAdminNewsletterSubscribe({
    email: subscriber.email,
  });
  const { error } = await resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: c.env.ADMIN_EMAILS.split(","),
    subject: "✨ Newsletter - user subscribed",
    html: emailAdmin.html,
    text: emailAdmin.text,
  });

  if (error) {
    return c.json(
      {
        status: "error",
        data: error,
      },
      { status: 400 },
    );
  }

  return c.json(
    {
      status: "success",
      data: { ...subscriber, confirmed: 1, confirmation_token: null },
    },
    200,
  );
});

app.delete("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .first<Subscriber>();

  if (!subscriber) {
    return c.json(
      {
        status: "error",
        data: `Subscriber with id ${subscriberId} not found.`,
      },
      404,
    );
  }

  await c.env.DB.prepare(`delete from subscribers where id = ?`)
    .bind(subscriberId)
    .run();

  // only send a notification about the unsubscription if the user is confirmed
  // i don't care about unconfirmed subscriptions, and we should purge them periodically
  if (subscriber.confirmed) {
    const resend = new Resend(c.env.API_KEY_RESEND);

    const emailAdmin = await renderEmailAdminNewsletterUnsubscribe({
      email: subscriber.email,
    });

    const { error } = await resend.emails.send({
      from: "NN1 Dev Club <club@nn1.dev>",
      to: c.env.ADMIN_EMAILS.split(","),
      subject: "✨ Newsletter - user unsubscribed",
      html: emailAdmin.html,
      text: emailAdmin.text,
    });

    if (error) {
      return c.json(
        {
          status: "error",
          data: error,
        },
        { status: 400 },
      );
    }
  }

  return c.json(
    {
      status: "success",
      data: subscriber,
    },
    200,
  );
});

export default app;
