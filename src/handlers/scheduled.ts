async function scheduled(
  controller: ScheduledController,
  env: Cloudflare.Env,
  ctx: ExecutionContext,
) {
  const db = env.DB;

  const query = await db
    .prepare(
      `delete from subscribers where confirmed = 0 and created_at < datetime('now', '-7 day')`,
    )
    .run();

  console.log(`Cleared ${query.meta.changes} unconfirmed subscribers`);
}

export default scheduled;
