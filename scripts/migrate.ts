import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { pool } from "../src/lib/db";

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function appliedIds(): Promise<Set<string>> {
  const res = await pool.query<{ id: string }>("SELECT id FROM schema_migrations");
  return new Set(res.rows.map((r) => r.id));
}

async function applyMigration(id: string, sql: string) {
  // Run the SQL as-is (you control the files)
  await pool.query("BEGIN");
  try {
    await pool.query(sql);
    await pool.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]);
    await pool.query("COMMIT");
    console.log(`Applied ${id}`);
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
}

async function main() {
  await ensureMigrationsTable();

  const done = await appliedIds();
  const dir = join(process.cwd(), "migrations");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(join(dir, file), "utf8");
    await applyMigration(file, sql);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
