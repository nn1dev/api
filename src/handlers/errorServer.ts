import { Context } from "hono";

const handlerErrorServer = (
  error: Error,
  c: Context<{ Bindings: Cloudflare.Env }>,
) => {
  console.error(error);
  return c.json(
    {
      status: "error",
      data: `Internal Server Error`,
    },
    500,
  );
};

export default handlerErrorServer;
