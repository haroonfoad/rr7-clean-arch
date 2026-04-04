import { pgTable, text } from "drizzle-orm/pg-core";

export const departments = pgTable("departments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
