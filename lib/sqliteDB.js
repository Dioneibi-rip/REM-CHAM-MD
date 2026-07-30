import { existsSync, readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const DEFAULT_DATA = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
  settings: {},
};

export class SQLiteJSONAdapter {
  constructor(filename = "database.sqlite") {
    this.filename = filename;
    this.legacyJson = filename.replace(/\.sqlite$/i, ".json");
    this.db = null;
    this.pendingWrite = Promise.resolve();
  }

  _open() {
    if (this.db) return this.db;
    const Database = require("better-sqlite3");
    this.db = new Database(this.filename);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("synchronous = NORMAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);
    return this.db;
  }

  read() {
    const db = this._open();
    const row = db.prepare("SELECT value FROM kv_store WHERE key = ?").get("global");
    if (row?.value) return JSON.parse(row.value);

    if (existsSync(this.legacyJson)) {
      const legacy = JSON.parse(readFileSync(this.legacyJson, "utf8") || "{}");
      return { ...DEFAULT_DATA, ...legacy };
    }

    return { ...DEFAULT_DATA };
  }

  write(data) {
    const payload = JSON.stringify({ ...DEFAULT_DATA, ...(data || {}) });
    this.pendingWrite = this.pendingWrite.then(
      () =>
        new Promise((resolve, reject) => {
          setImmediate(() => {
            try {
              const db = this._open();
              db.prepare(`
                INSERT INTO kv_store (key, value, updated_at)
                VALUES (@key, @value, @updated_at)
                ON CONFLICT(key) DO UPDATE SET
                  value = excluded.value,
                  updated_at = excluded.updated_at
              `).run({
                key: "global",
                value: payload,
                updated_at: Date.now(),
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        }),
    );
    return this.pendingWrite;
  }
}
