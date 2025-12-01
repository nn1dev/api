import { Context, Next } from "hono";

const auth = async (c: Context<{ Bindings: Cloudflare.Env }>, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ status: "error", data: "Unauthorized" }, 401);
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (token !== c.env.AUTH) {
    return c.json({ status: "error", data: "Unauthorized" }, 401);
  }

  return next();
};

export default auth;
