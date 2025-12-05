import { Hono } from "hono";
import { Resend } from "resend";
import z from "zod";
import { renderEmailAdminNewsletterSubscribe } from "../../emails/admin-newsletter-subscribe";
import { renderEmailAdminNewsletterUnsubscribe } from "../../emails/admin-newsletter-unsubscribe";
import auth from "../middlewares/auth";

const app = new Hono<{ Bindings: Cloudflare.Env }>();
app.use(auth);

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
        data: `Subscriber not found.`,
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

const SubscribersPostBodySchema = z.object({
  email: z.email().toLowerCase(),
});

app.post("/", async (c) => {
  const body = SubscribersPostBodySchema.safeParse(await c.req.json());

  if (!body.success) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data.",
      },
      400,
    );
  }

  const { email } = body.data;

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where email = ?`,
  )
    .bind(email)
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

  const [_, subscriberResult] = await c.env.DB.batch<Subscriber>([
    c.env.DB.prepare(
      `insert into subscribers (id, email, confirmed, confirmation_token) values (?, ?, ?, ?)`,
    ).bind(id, email, 0, confirmation_token),
    c.env.DB.prepare(`select * from subscribers where id = ?`).bind(id),
  ]);

  if (!subscriberResult.results.length) {
    return c.json(
      {
        status: "error",
        data: `Subscriber not found.`,
      },
      404,
    );
  }

  const newSubscriber = subscriberResult.results[0];

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
  //     400,
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

const SubscribersPutBodySchema = z.object({
  confirmationToken: z.uuid(),
});

app.put("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();
  const body = SubscribersPutBodySchema.safeParse(await c.req.json());

  if (!body.success) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data.",
      },
      400,
    );
  }

  const { confirmationToken } = body.data;

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .first<Subscriber>();

  if (!subscriber || subscriber.confirmation_token !== confirmationToken) {
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
      400,
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

  const [subscriberResult, _] = await c.env.DB.batch<Subscriber>([
    c.env.DB.prepare(`select * from subscribers where id = ?`).bind(
      subscriberId,
    ),
    c.env.DB.prepare(`delete from subscribers where id = ?`).bind(subscriberId),
  ]);

  if (!subscriberResult.results.length) {
    return c.json(
      {
        status: "error",
        data: `Subscriber not found.`,
      },
      404,
    );
  }

  const subscriber = subscriberResult.results[0];

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
      400,
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

export default app;
