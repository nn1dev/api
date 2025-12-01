import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./middlewares/auth";
import handlerErrorNotFound from "./handlers/errorNotFound";
import handlerErrorServer from "./handlers/errorServer";
import subscribers from "./handlers/subscribers";
import tickets from "./handlers/tickets";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

// middlewares
app.use(logger());
app.use(auth);

// 404 & 500
app.notFound(handlerErrorNotFound);
app.onError(handlerErrorServer);

// routes
app.route("/subscribers", subscribers);
app.route("/tickets", tickets);

export default app;
