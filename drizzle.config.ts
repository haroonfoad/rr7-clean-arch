import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./app/modules/**/infrastructure/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "./organization.db",
  },
});
