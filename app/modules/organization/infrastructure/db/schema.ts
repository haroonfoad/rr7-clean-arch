import { pgTable, text } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export type OrganizationRecord = typeof organizations.$inferSelect;
