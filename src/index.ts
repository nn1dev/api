import { Hono } from "hono";
import { logger } from "hono/logger";
import { withSentry } from "@sentry/cloudflare";
import handlerErrorNotFound from "./handlers/errorNotFound";
import handlerErrorServer from "./handlers/errorServer";
import status from "./handlers/status";
import subscribers from "./handlers/subscribers";
import tickets from "./handlers/tickets";
import broadcast from "./handlers/broadcast";
// import sentryTracing from "./middlewares/sentry-tracing";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

// middlewares
app.use(logger());
// app.use(sentryTracing);

// 404 & 500
app.notFound(handlerErrorNotFound);
app.onError(handlerErrorServer);

// routes
app.get("/status", status);
app.route("/subscribers", subscribers);
app.route("/tickets", tickets);
app.route("/broadcast", broadcast);

export default withSentry((env: Cloudflare.Env) => {
  return {
    dsn: "https://e6e2b273e018ce8f05569c395cf9b7a0@o4507649139146752.ingest.de.sentry.io/4510492115796048",
    release: env.SENTRY_RELEASE,
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
    // Enable logs to be sent to Sentry
    enableLogs: true,
    // Set tracesSampleRate to 1.0 to capture 100% of spans for tracing.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options/#tracesSampleRate
    tracesSampleRate: 1.0,
    environment: env.URL_CLIENT.includes("localhost")
      ? "development"
      : "production",
  };
}, app);
