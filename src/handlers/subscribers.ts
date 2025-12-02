import { Hono } from "hono";
import { normalizeEmail } from "../utils";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(`select * from subscribers`).run();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Subscriber with id ${subscriberId} not found`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: results[0],
    },
    200,
  );
});

app.post("/", async (c) => {
  const { email } = await c.req.json();

  if (!email) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data",
      },
      400,
    );
  }

  const normalizeBodyEmail = normalizeEmail(email);

  const { results } = await c.env.DB.prepare(
    `select * from subscribers where email = ?`,
  )
    .bind(normalizeBodyEmail)
    .run();

  if (results?.length) {
    return c.json(
      {
        status: "success",
        data: results[0],
      },
      201,
    );
  }

  const id = crypto.randomUUID();
  const confirmation_token = crypto.randomUUID();
  await c.env.DB.prepare(
    `insert into subscribers (id, email, confirmed, confirmation_token) values (?, ?, ?, ?)`,
  )
    .bind(id, normalizeBodyEmail, false, confirmation_token)
    .run();

  const { results: results2 } = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(id)
    .run();

  if (!results2?.length) {
    return c.json(
      {
        status: "error",
        data: `Subscriber with id ${id} not found`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: results2[0],
    },
    201,
  );
});

app.put("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();

  // TODO: Better payload validation
  const { confirmationToken } = await c.req.json();

  const { results } = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .run();

  if (!results?.length || results[0].confirmation_token !== confirmationToken) {
    return c.json(
      {
        status: "error",
        data: "invalid subscriber id or confirmation token",
      },
      404,
    );
  }

  await c.env.DB.prepare(
    `update subscribers set confirmed = ?, confirmation_token = ? where id = ?`,
  )
    .bind(true, "", subscriberId)
    .run();

  return c.json(
    {
      status: "success",
      data: { ...results[0], confirmed: 1 },
    },
    200,
  );
});

app.delete("/:subscriberId", async (c) => {
  const { subscriberId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from subscribers where id = ?`,
  )
    .bind(subscriberId)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Subscriber with id ${subscriberId} not found`,
      },
      404,
    );
  }

  await c.env.DB.prepare(`delete from subscribers where id = ?`)
    .bind(subscriberId)
    .run();

  return c.json(
    {
      status: "success",
      data: results[0],
    },
    200,
  );
});

export default app;
