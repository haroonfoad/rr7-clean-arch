import "dotenv/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

type DepartmentDb = NodePgDatabase<typeof schema>;

let db: DepartmentDb | undefined;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
  }

  return url;
}

export function getDepartmentDb(): DepartmentDb {
  if (!db) {
    const pool = new Pool({ connectionString: getDatabaseUrl() });
    db = drizzle(pool, { schema });
  }

  return db;
}
