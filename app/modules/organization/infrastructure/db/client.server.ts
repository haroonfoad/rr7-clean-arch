import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

type OrganizationDb = BetterSQLite3Database<typeof schema>;

let db: OrganizationDb | undefined;

export function getOrganizationDb(): OrganizationDb {
  if (!db) {
    const sqlite = new Database("organization.db");
    db = drizzle(sqlite, { schema });
  }

  return db;
}
