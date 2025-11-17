import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { participatedCompetitions } from "./competitions";

export const rovers = pgTable("rover", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  image: t.text("image").notNull(),
  name: t.varchar("name", { length: 100 }).notNull(),
  tag: t
    .text("tag")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  description: t.text("description").notNull(),
  weight: t.text("weight").notNull(),
  power: t.text("power").notNull(),
  arm: t.text("arm").notNull(),
  dimentions: t.text("dimentions").notNull(),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  from: t.timestamp("from", { mode: "date" }).defaultNow().notNull(),
  until: t.timestamp("until", { mode: "date" }),
  keyAchievements: t
    .text("key_achievements")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  features: t
    .text("features")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
}));

export type Rovers = typeof rovers.$inferSelect;
export type RoversInsert = typeof rovers.$inferInsert;

// Rovers relation - one-to-many with competitions
export const roverCompetitionRelation = relations(rovers, ({ many }) => ({
  competitions: many(participatedCompetitions),
}));
