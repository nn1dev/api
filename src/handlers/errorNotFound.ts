import { Context } from "hono";

const handlerErrorNotFound = (context: Context<{ Bindings: Cloudflare.Env }>) =>
  context.json(
    {
      status: "error",
      data: "The route was not found",
    },
    404,
  );

export default handlerErrorNotFound;
