import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rsvps = sqliteTable("rsvps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestName: text("guest_name"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  plusOneName: text("plus_one_name"),
  attending: text("attending", { enum: ["yes", "no"] }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
