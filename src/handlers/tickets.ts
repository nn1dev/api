import { Hono } from "hono";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(`select * from tickets`).run();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:eventId", async (c) => {
  const { eventId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ?`,
  )
    .bind(eventId)
    .run();

  return c.json(
    {
      status: "success",
      data: results,
    },
    200,
  );
});

app.get("/:eventId/:ticketId", async (c) => {
  const { eventId, ticketId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ? and id = ?`,
  )
    .bind(eventId, ticketId)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket with id ${ticketId} not found`,
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
  const {
    name,
    email,
    eventId,
    eventName,
    eventDate,
    eventLocation,
    eventInviteUrlIcal,
    eventInviteUrlGoogle,
  } = await c.req.json();

  if (
    !email ||
    !name ||
    !eventId ||
    !eventName ||
    !eventDate ||
    !eventLocation ||
    !eventInviteUrlIcal ||
    !eventInviteUrlGoogle
  ) {
    return c.json(
      {
        status: "error",
        data: "Incorrect request data",
      },
      400,
    );
  }

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `insert into tickets (id, event_id, email, name, confirmed) values (?, ?, ?, ?, ?)`,
  )
    .bind(id, eventId, email, name, false)
    .run();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where id = ?`,
  )
    .bind(id)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket with id ${id} not found`,
      },
      404,
    );
  }

  return c.json(
    {
      status: "success",
      data: results[0],
    },
    201,
  );
});

app.put("/:eventId/:ticketId", async (c) => {
  const { eventId, ticketId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ? and id = ?`,
  )
    .bind(eventId, ticketId)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket with id ${ticketId} not found`,
      },
      404,
    );
  }

  await c.env.DB.prepare(
    `update tickets set confirmed = ? where event_id = ? and id = ?`,
  )
    .bind(true, eventId, ticketId)
    .run();

  return c.json(
    {
      status: "success",
      data: { ...results[0], confirmed: true },
    },
    200,
  );
});

app.delete("/:eventId/:ticketId", async (c) => {
  const { eventId, ticketId } = c.req.param();

  const { results } = await c.env.DB.prepare(
    `select * from tickets where event_id = ? and id = ?`,
  )
    .bind(eventId, ticketId)
    .run();

  if (!results?.length) {
    return c.json(
      {
        status: "error",
        data: `Ticket with id ${ticketId} not found`,
      },
      404,
    );
  }

  await c.env.DB.prepare(`delete from tickets where event_id = ? and id = ?`)
    .bind(eventId, ticketId)
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
