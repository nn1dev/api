import { Hono } from "hono";
import { Resend } from "resend";
import z from "zod";
import { instrumentD1WithSentry, captureException } from "@sentry/cloudflare";
import {
  renderEmailNewsletter_2026_03_24,
  renderEmailEvent_11_2026_03_25,
  renderEmailEvent_10_2026_03_27,
} from "../../emails";
import { chunkArray } from "../utils";
import auth from "../middlewares/auth";
import { EMAIL_FROM, ERROR_MESSAGE_BAD_REQUEST } from "../constants";
import { renderEmailEvent_11_2026_03_27 } from "../../emails/event-11-2026-03-27";

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
  // "2026-01-27": {
  //   template: renderEmailNewsletter_2026_01_27,
  //   subject: "✨ NN1 Dev Club #10 is on Thursday!",
  // },
  "2026-03-24": {
    template: renderEmailNewsletter_2026_03_24,
    subject: "✨ NN1 Dev Club #11 is on Thursday!",
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
  "11-2026-03-25": {
    template: renderEmailEvent_11_2026_03_25,
    subject: "✨ NN1 Dev Club #11 - See you tomorrow!",
  },
  "11-2026-03-27": {
    template: renderEmailEvent_11_2026_03_27,
    subject: "✨ NN1 Dev Club #11 - Thank you for attending!",
  },
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
    from: EMAIL_FROM,
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
  c.set("db", instrumentD1WithSentry(c.env.DB));
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
        data: ERROR_MESSAGE_BAD_REQUEST,
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
        data: ERROR_MESSAGE_BAD_REQUEST,
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
  } catch (error) {
    captureException(error);
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
        data: ERROR_MESSAGE_BAD_REQUEST,
      },
      400,
    );
  }

  const { template: bodyTemplate, eventId: bodyEventId } = body.data;

  if (!Object.keys(TEMPLATE_MAPPER_EVENT).includes(bodyTemplate)) {
    return c.json(
      {
        status: "error",
        data: ERROR_MESSAGE_BAD_REQUEST,
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
  } catch (error) {
    captureException(error);
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
