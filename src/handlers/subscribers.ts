import { Hono } from "hono";
import { Resend } from "resend";
import z from "zod";
import {
  captureException,
  captureMessage,
  instrumentD1WithSentry,
} from "@sentry/cloudflare";
import { renderEmailAdminNewsletterSubscribe } from "../../emails/admin-newsletter-subscribe";
import { renderEmailAdminNewsletterUnsubscribe } from "../../emails/admin-newsletter-unsubscribe";
import { renderEmailSubscriberConfirm } from "../../emails/newsletter-confirm";
import auth from "../middlewares/auth";
import {
  ERROR_MESSAGE_BAD_REQUEST,
  ERROR_MESSAGE_DATA_CONFLICT,
} from "../constants";

const app = new Hono<{
  Bindings: Cloudflare.Env;
  Variables: { db: D1Database };
}>();

app.use(auth);
app.use("*", async (c, next) => {
  c.set("db", instrumentD1WithSentry(c.env.DB));
  await next();
});

app.get("/", async (c) => {
  const db = c.get("db");

  const { results } = await db
    .prepare(`select * from subscribers`)
    .all<Subscriber>();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:subscriberId", async (c) => {
  const db = c.get("db");
  const { subscriberId } = c.req.param();

  const subscriber = await db
    .prepare(`select * from subscribers where id = ?`)
    .bind(subscriberId)
    .first<Subscriber>();

  if (!subscriber) {
    captureMessage(ERROR_MESSAGE_BAD_REQUEST, {
      level: "error",
      extra: {
        subscriberId,
      },
    });
    return c.json(
      {
        status: "error",
        data: ERROR_MESSAGE_BAD_REQUEST,
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
  const db = c.get("db");
  const body = SubscribersPostBodySchema.safeParse(await c.req.json());

  if (!body.success) {
    captureMessage(ERROR_MESSAGE_BAD_REQUEST, {
      level: "error",
      extra: {
        body: await c.req.text(),
      },
    });
    return c.json(
      {
        status: "error",
        data: ERROR_MESSAGE_BAD_REQUEST,
      },
      400,
    );
  }

  const { email } = body.data;

  const subscriber = await db
    .prepare(`select * from subscribers where email = ?`)
    .bind(email)
    .first<Subscriber>();

  if (subscriber) {
    return c.json(
      {
        status: "success",
        data: subscriber,
      },
      200,
    );
  }

  const id = crypto.randomUUID();
  const confirmation_token = crypto.randomUUID();

  const [_, subscriberResult] = await db.batch<Subscriber>([
    db
      .prepare(
        `insert into subscribers (id, email, confirmed, confirmation_token) values (?, ?, ?, ?)`,
      )
      .bind(id, email, 0, confirmation_token),
    db.prepare(`select * from subscribers where id = ?`).bind(id),
  ]);

  if (!subscriberResult.results.length) {
    captureException(new Error(ERROR_MESSAGE_DATA_CONFLICT));
    return c.json(
      {
        status: "error",
        data: ERROR_MESSAGE_DATA_CONFLICT,
      },
      404,
    );
  }

  const newSubscriber = subscriberResult.results[0];

  const emailTemplate = await renderEmailSubscriberConfirm({
    url: `${c.env.URL_CLIENT}/newsletter/${newSubscriber.id}/${newSubscriber.confirmation_token}`,
  });

  const resend = new Resend(c.env.API_KEY_RESEND);

  const { error } = await resend.emails.send({
    from: "NN1 Dev Club <club@nn1.dev>",
    to: email,
    subject: "Confirm your email please",
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  if (error) {
    captureException(error);
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
      data: newSubscriber,
    },
    201,
  );
});

const SubscribersPutBodySchema = z.object({
  confirmationToken: z.uuid(),
});

app.put("/:subscriberId", async (c) => {
  const db = c.get("db");
  const { subscriberId } = c.req.param();
  const body = SubscribersPutBodySchema.safeParse(await c.req.json());

  if (!body.success) {
    captureMessage(ERROR_MESSAGE_BAD_REQUEST, {
      level: "error",
      extra: {
        body: await c.req.text(),
      },
    });
    return c.json(
      {
        status: "error",
        data: ERROR_MESSAGE_BAD_REQUEST,
      },
      400,
    );
  }

  const { confirmationToken } = body.data;

  const subscriber = await db
    .prepare(`select * from subscribers where id = ?`)
    .bind(subscriberId)
    .first<Subscriber>();

  if (!subscriber || subscriber.confirmation_token !== confirmationToken) {
    captureMessage(ERROR_MESSAGE_BAD_REQUEST, {
      level: "error",
      extra: {
        subscriberId,
        confirmationToken,
      },
    });
    return c.json(
      {
        status: "error",
        data: ERROR_MESSAGE_BAD_REQUEST,
      },
      400,
    );
  }

  await db
    .prepare(
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
    captureException(error);
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
  const db = c.get("db");
  const { subscriberId } = c.req.param();

  const [subscriberResult, _] = await db.batch<Subscriber>([
    db.prepare(`select * from subscribers where id = ?`).bind(subscriberId),
    db.prepare(`delete from subscribers where id = ?`).bind(subscriberId),
  ]);

  if (!subscriberResult.results.length) {
    captureMessage(ERROR_MESSAGE_BAD_REQUEST, {
      level: "error",
      extra: {
        subscriberId,
      },
    });
    return c.json(
      {
        status: "error",
        data: ERROR_MESSAGE_BAD_REQUEST,
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
    captureException(error);
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
