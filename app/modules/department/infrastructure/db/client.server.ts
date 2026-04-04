import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

type DepartmentDb = BetterSQLite3Database<typeof schema>;

let db: DepartmentDb | undefined;

function ensureSchema(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);
}

export function getDepartmentDb(): DepartmentDb {
  if (!db) {
    const sqlite = new Database("organization.db");
    ensureSchema(sqlite);
    db = drizzle(sqlite, { schema });
  }

  return db;
}
