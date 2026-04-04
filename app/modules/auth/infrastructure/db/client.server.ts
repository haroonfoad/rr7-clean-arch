import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

type AuthDb = BetterSQLite3Database<typeof schema>;

let db: AuthDb | undefined;

export function getAuthDb(): AuthDb {
  if (!db) {
    const sqlite = new Database("organization.db");
    db = drizzle(sqlite, { schema });
  }

  return db;
}
