import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const wclAuth = sqliteTable("wcl_auth", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull(),
  expiresAt: integer("start_time", { mode: "timestamp_ms" }).notNull(),

  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type SelectWclAuth = typeof wclAuth.$inferSelect;
export type InsertWclAuth = typeof wclAuth.$inferInsert;
