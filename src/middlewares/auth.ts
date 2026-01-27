import { Context, Next } from "hono";
import { ERROR_MESSAGE_UNAUTHORIZED } from "../constants";

const auth = async (c: Context<{ Bindings: Cloudflare.Env }>, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ status: "error", data: ERROR_MESSAGE_UNAUTHORIZED }, 401);
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (token !== c.env.AUTH) {
    return c.json({ status: "error", data: ERROR_MESSAGE_UNAUTHORIZED }, 401);
  }

  return next();
};

export default auth;
