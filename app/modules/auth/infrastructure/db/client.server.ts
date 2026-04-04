import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

type AuthDb = BetterSQLite3Database<typeof schema>;

let db: AuthDb | undefined;

function ensureSchema(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const defaultUsername = process.env.AUTH_USERNAME ?? "admin";
  const defaultPassword = process.env.AUTH_PASSWORD ?? "admin123";

  const existing = sqlite
    .prepare("SELECT id FROM users WHERE username = ?")
    .get(defaultUsername) as { id: string } | undefined;

  if (!existing) {
    sqlite
      .prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)")
      .run("local-admin", defaultUsername, defaultPassword);
  }
}

export function getAuthDb(): AuthDb {
  if (!db) {
    const sqlite = new Database("organization.db");
    ensureSchema(sqlite);
    db = drizzle(sqlite, { schema });
  }

  return db;
}
