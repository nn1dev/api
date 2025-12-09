import { Context } from "hono";

const status = (c: Context<{ Bindings: Cloudflare.Env }>) =>
  c.json(
    {
      status: "success",
      data: "🐘💨",
    },
    200,
  );

export default status;
