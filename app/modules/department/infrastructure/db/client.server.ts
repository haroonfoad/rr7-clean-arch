import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

type DepartmentDb = BetterSQLite3Database<typeof schema>;

let db: DepartmentDb | undefined;

export function getDepartmentDb(): DepartmentDb {
  if (!db) {
    const sqlite = new Database("organization.db");
    db = drizzle(sqlite, { schema });
  }

  return db;
}
