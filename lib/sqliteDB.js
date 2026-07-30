import { existsSync, readFileSync } from "fs";
import path from "path";
import Database from "better-sqlite3";

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
  }

  _open() {
    if (this.db) return this.db;
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
    const db = this._open();
    db.prepare(`
      INSERT INTO kv_store (key, value, updated_at)
      VALUES (@key, @value, @updated_at)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at
    `).run({
      key: "global",
      value: JSON.stringify({ ...DEFAULT_DATA, ...(data || {}) }),
      updated_at: Date.now(),
    });
  }
}

export function sqliteDatabasePath(prefix = "") {
  return path.resolve(`${prefix}database.sqlite`);
}
