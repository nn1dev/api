import { Hono } from "hono";
import { normalizeEmail } from "../utils";
import { renderEmailAdminNewsletterSubscribe } from "../../emails/admin-newsletter-subscribe";
import { Resend } from "resend";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

export interface Subscriber {
  id: string;
  email: string;
  confirmed: number;
  confirmation_token: string | null;
  created_at: string;
}

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `select * from subscribers`,
  ).all<Subscriber>();

  console.log({ results });

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
        data: `Subscriber with id ${subscriberId} not found`,
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

app.post("/", async (c) => {
  const { email } = await c.req.json<{ email: string }>();

  if (!email) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data",
      },
      400,
    );
  }

  const normalizeBodyEmail = normalizeEmail(email);

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where email = ?`,
  )
    .bind(normalizeBodyEmail)
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
    .bind(id, normalizeBodyEmail, false, confirmation_token)
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
        data: `Subscriber with id ${id} not found`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: newSubscriber,
    },
    201,
  );
});

app.put("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();

  // TODO: Better payload validation
  const { confirmationToken } = await c.req.json<{
    confirmationToken: string;
  }>();

  const subscriber = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .first<Subscriber>();

  if (!subscriber || subscriber.confirmation_token !== confirmationToken) {
    return c.json(
      {
        status: "error",
        data: "invalid subscriber id or confirmation token",
      },
      404,
    );
  }

  await c.env.DB.prepare(
    `update subscribers set confirmed = ?, confirmation_token = ? where id = ?`,
  )
    .bind(true, null, subscriberId)
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
        data: `Subscriber with id ${subscriberId} not found`,
      },
      404,
    );
  }

  await c.env.DB.prepare(`delete from subscribers where id = ?`)
    .bind(subscriberId)
    .run();

  return c.json(
    {
      status: "success",
      data: subscriber,
    },
    200,
  );
});

export default app;
