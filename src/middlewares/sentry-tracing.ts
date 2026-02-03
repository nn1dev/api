import { Context, Next } from "hono";
import { continueTrace, startSpan } from "@sentry/cloudflare";

const sentryTracing = async (
  c: Context<{ Bindings: Cloudflare.Env }>,
  next: Next,
) => {
  const method = c.req.method;
  const path = new URL(c.req.url).pathname;

  // Extract trace headers from incoming request
  const sentryTrace = c.req.header("sentry-trace");
  const baggage = c.req.header("baggage");

  return await continueTrace({ sentryTrace, baggage }, async () => {
    return await startSpan(
      {
        name: `${method} ${path}`,
        op: "http.server",
        attributes: {
          "http.method": method,
          "http.route": path,
          "http.url": c.req.url,
        },
      },
      async (span) => {
        await next();

        // Add response status to span
        span?.setAttribute("http.status_code", c.res.status);

        return c.res;
      },
    );
  });
};

export default sentryTracing;
