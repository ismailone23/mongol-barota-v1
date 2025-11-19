import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { competitions } from "./competitions";

export const rovers = pgTable("rover", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  image: t.text("image").notNull(),
  name: t.varchar("name", { length: 100 }).notNull(),
  status: t.varchar("status").notNull(),
  description: t.text("description").notNull(),
  spec: t
    .jsonb("spec")
    .$type<{
      weight: string;
      power: string;
      arm: string;
      dimensions: string;
      autonomy: string;
      communications: string;
    }>()
    .notNull(),
  year: t.timestamp("year", { mode: "date" }).defaultNow().notNull(),
  ended: t.timestamp("ended", { mode: "date" }),
  achievements: t
    .text("achievements")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  features: t
    .text("features")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type RoversSelect = typeof rovers.$inferSelect;
export type RoversInsert = typeof rovers.$inferInsert;

export const roverCompetitionRelation = relations(rovers, ({ many }) => ({
  competitions: many(competitions),
}));
