import { Hono } from "hono";
import { Resend } from "resend";
import z from "zod";
import * as Sentry from "@sentry/cloudflare";
import { renderEmailNewsletter_2025_12_06 } from "../../emails";
import { chunkArray } from "../utils";
import auth from "../middlewares/auth";

// https://resend.mintlify.dev/docs/api-reference/emails/send-batch-emails
const RESEND_MAX_BATCH_CHUNK = 100;

const TEMPLATE_MAPPER_NEWSLETTER: Record<
  string,
  {
    template: (props: { unsubscribeUrl: string }) => Promise<{
      html: string;
      text: string;
    }>;
    subject: string;
  }
> = {
  // "test-newsletter": {
  //   template: renderEmailNewsletterTest,
  //   subject: "✨ NN1 Dev Club #Test Newsletter",
  // },
  "2025-12-06": {
    template: renderEmailNewsletter_2025_12_06,
    subject: "✨ NN1 Dev Club #10",
  },
};

const TEMPLATE_MAPPER_EVENT: Record<
  string,
  {
    template: (props: { ticketUrl: string }) => Promise<{
      html: string;
      text: string;
    }>;
    subject: string;
  }
> = {
  // "test-event": {
  //   template: renderEmailEventTest,
  //   subject: "✨ NN1 Dev Club #Test Event",
  // },
};

async function createEmailPayload({
  to,
  subject,
  templatePromise,
}: {
  to: string;
  subject: string;
  templatePromise: () => Promise<{
    html: string;
    text: string;
  }>;
}) {
  const { html, text } = await templatePromise();

  return {
    from: "NN1 Dev Club <club@nn1.dev>",
    to,
    subject,
    html,
    text,
  };
}

const app = new Hono<{
  Bindings: Cloudflare.Env;
  Variables: { db: D1Database };
}>();
app.use(auth);
app.use("*", async (c, next) => {
  c.set("db", Sentry.instrumentD1WithSentry(c.env.DB));
  await next();
});

const BroadcastNewsletterBodySchema = z.object({
  template: z.string(),
  excludeMembersEventId: z.number().optional(),
});

app.post("/newsletter", async (c) => {
  const db = c.get("db");
  const body = BroadcastNewsletterBodySchema.safeParse(await c.req.json());

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
    template: bodyTemplate,
    excludeMembersEventId: bodyExcludeMembersEventId,
  } = body.data;

  if (!Object.keys(TEMPLATE_MAPPER_NEWSLETTER).includes(bodyTemplate)) {
    return c.json(
      {
        status: "error",
        data: "Template is not configured.",
      },
      400,
    );
  }

  const template =
    TEMPLATE_MAPPER_NEWSLETTER[
      bodyTemplate as keyof typeof TEMPLATE_MAPPER_NEWSLETTER
    ];

  const { results: subscribers } = await db
    .prepare(`select * from subscribers where confirmed = 1`)
    .all<Subscriber>();

  const excludedMembers = bodyExcludeMembersEventId
    ? (
        await db
          .prepare(`select * from tickets where event_id = ? and confirmed = 1`)
          .bind(bodyExcludeMembersEventId)
          .all<Ticket>()
      ).results
    : [];

  const entries = subscribers.filter(
    (s) => !excludedMembers.some((t) => t.email === s.email),
  );

  const payloads = await Promise.all(
    entries.map((entry) =>
      createEmailPayload({
        to: entry.email,
        subject: template.subject,
        templatePromise: () =>
          template.template({
            unsubscribeUrl: `${c.env.URL_CLIENT}/newsletter/unsubscribe/${entry.id}`,
          }),
      }),
    ),
  );

  const payloadsChunked = chunkArray(payloads, RESEND_MAX_BATCH_CHUNK);

  const resend = new Resend(c.env.API_KEY_RESEND);

  try {
    for (const chunk of payloadsChunked) {
      await resend.batch.send(chunk);
    }
  } catch {
    return c.json(
      {
        status: "error",
        data: "Failed to schedule an email.",
      },
      500,
    );
  }

  return c.json(
    {
      status: "success",
      data: entries.map((e) => e.email),
    },
    200,
  );
});

const BroadcastEventBodySchema = z.object({
  template: z.string(),
  eventId: z.number(),
});

app.post("/event", async (c) => {
  const db = c.get("db");
  const body = BroadcastEventBodySchema.safeParse(await c.req.json());

  if (!body.success) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data.",
      },
      400,
    );
  }

  const { template: bodyTemplate, eventId: bodyEventId } = body.data;

  if (!Object.keys(TEMPLATE_MAPPER_EVENT).includes(bodyTemplate)) {
    return c.json(
      {
        status: "error",
        data: "Template is not configured.",
      },
      400,
    );
  }

  const template =
    TEMPLATE_MAPPER_EVENT[bodyTemplate as keyof typeof TEMPLATE_MAPPER_EVENT];

  const entries = (
    await db
      .prepare(`select * from tickets where event_id = ? and confirmed = 1`)
      .bind(bodyEventId)
      .all<Ticket>()
  ).results;

  const payloads = await Promise.all(
    entries.map((entry) =>
      createEmailPayload({
        to: entry.email,
        subject: template.subject,
        templatePromise: () =>
          template.template({
            ticketUrl: `${c.env.URL_CLIENT}/events/${entry.event_id}/${entry.id}`,
          }),
      }),
    ),
  );

  const payloadsChunked = chunkArray(payloads, RESEND_MAX_BATCH_CHUNK);

  const resend = new Resend(c.env.API_KEY_RESEND);

  try {
    for (const chunk of payloadsChunked) {
      await resend.batch.send(chunk);
    }
  } catch {
    return c.json(
      {
        status: "error",
        data: "Failed to schedule an email.",
      },
      500,
    );
  }

  return c.json(
    {
      status: "success",
      data: entries.map((e) => e.email),
    },
    200,
  );
});

export default app;
