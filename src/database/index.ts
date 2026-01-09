
import { Database } from "bun:sqlite";
import { initAuthCreds, BufferJSON } from "baileys";

type Row = {
  key: string;
  value: string;
};

export const db = new Database("./axo.db");

db.run("PRAGMA journal_mode = WAL;");
db.run(`
  CREATE TABLE IF NOT EXISTS wa_auth (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

db.run(`state
   CREATE TABLE IF NOT EXISTS muted_users (
      user TEXT PRIMARY KEY,
      muted_until BIGINT NOT NULL,
      reason TEXT NOT NULL
   )
`)


export const use_sqlite_auth = async () => {
  const row = db
    .query("SELECT value FROM wa_auth WHERE key = 'creds'")
    .get() as Row;

  const creds = row
    ? JSON.parse(row.value, BufferJSON.reviver)
    : initAuthCreds();

  const insertStmt = db.prepare(
    "INSERT OR REPLACE INTO wa_auth (key, value) VALUES (?, ?)"
  );

  return {
    state: {
      creds,
      keys: {
        get: async (type: string, ids: string[]) => {
          if (ids.length === 0) return {};

          const placeholders = ids.map(() => "?").join(",");
          const rows = db
            .query(
              `SELECT key, value FROM wa_auth WHERE key IN (${placeholders})`
            )
            .all(...ids.map(id => `${type}:${id}`)) as Row[];

          return Object.fromEntries(
            rows.map(r => [
              r.key.split(":")[1],
              JSON.parse(r.value, BufferJSON.reviver),
            ])
          );
        },

        set: async (data: any) => {
          for (const type in data) {
            for (const id in data[type]) {
              insertStmt.run(
                `${type}:${id}`,
                JSON.stringify(data[type][id], BufferJSON.replacer)
              );
            }
          }
        },
      },
    },
    save_creds: async () => {
      insertStmt.run(
        "creds",
        JSON.stringify(creds, BufferJSON.replacer)
      );
    },
  };
};
