import { Hono } from "hono";
import { logger } from "hono/logger";
import * as Sentry from "@sentry/cloudflare";
import handlerErrorNotFound from "./handlers/errorNotFound";
import handlerErrorServer from "./handlers/errorServer";
import status from "./handlers/status";
import subscribers from "./handlers/subscribers";
import tickets from "./handlers/tickets";
import broadcast from "./handlers/broadcast";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

// middlewares
app.use(logger());

// 404 & 500
app.notFound(handlerErrorNotFound);
app.onError(handlerErrorServer);

// routes
app.get("/status", status);
app.get("/sentry", async () => {
  await Sentry.startSpan(
    {
      op: "test",
      name: "My First Test Transaction",
    },
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
      throw new Error("My second Sentry error!");
    },
  );
});
app.route("/subscribers", subscribers);
app.route("/tickets", tickets);
app.route("/broadcast", broadcast);

export default Sentry.withSentry((env: Cloudflare.Env) => {
  const { id: versionId } = env.CF_VERSION_METADATA;
  return {
    dsn: "https://e6e2b273e018ce8f05569c395cf9b7a0@o4507649139146752.ingest.de.sentry.io/4510492115796048",
    release: versionId,
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    // Enable logs to be sent to Sentry
    enableLogs: true,
    // Set tracesSampleRate to 1.0 to capture 100% of spans for tracing.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options/#tracesSampleRate
    tracesSampleRate: 1.0,
  };
}, app);
