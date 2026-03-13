import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const mediaCoverages = pgTable("media_coverages", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  title: t.text("title").notNull(),
  outlet: t.varchar("outlet", { length: 200 }).notNull(),
  type: t.varchar("type", { length: 20 }).notNull(), // tv, print, online
  year: t.varchar("year", { length: 10 }).notNull(),
  date: t.varchar("date", { length: 50 }).notNull(),
  description: t.text("description"),
  image: t.text("image"),
  images: t
    .jsonb("images")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  link: t.text("link"),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type MediaCoverageSelect = typeof mediaCoverages.$inferSelect;
export type MediaCoverageInsert = typeof mediaCoverages.$inferInsert;
