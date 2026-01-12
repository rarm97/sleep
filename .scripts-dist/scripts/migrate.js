"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const db_1 = require("../src/lib/db");
async function ensureMigrationsTable() {
    await db_1.pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
async function appliedIds() {
    const res = await db_1.pool.query("SELECT id FROM schema_migrations");
    return new Set(res.rows.map((r) => r.id));
}
async function applyMigration(id, sql) {
    // Run the SQL as-is (you control the files)
    await db_1.pool.query("BEGIN");
    try {
        await db_1.pool.query(sql);
        await db_1.pool.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]);
        await db_1.pool.query("COMMIT");
        console.log(`Applied ${id}`);
    }
    catch (e) {
        await db_1.pool.query("ROLLBACK");
        throw e;
    }
}
async function main() {
    await ensureMigrationsTable();
    const done = await appliedIds();
    const dir = (0, node_path_1.join)(process.cwd(), "migrations");
    const files = (await (0, promises_1.readdir)(dir)).filter((f) => f.endsWith(".sql")).sort();
    for (const file of files) {
        if (done.has(file))
            continue;
        const sql = await (0, promises_1.readFile)((0, node_path_1.join)(dir, file), "utf8");
        await applyMigration(file, sql);
    }
    await db_1.pool.end();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
