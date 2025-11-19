import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { sponsors } from "./sponsors";
import { competitionMembers } from "./team";
import { rovers } from "./rovers";

export const regionKeys = ["urc", "arc", "erc"] as const;

export const regionEnum = pgEnum("region_key", regionKeys);
export type Region = typeof regionKeys;

export const competitions = pgTable("competitions", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  region: regionEnum().notNull(),
  name: t.text("name").notNull(),
  description: t.text("description").notNull(),
  location: t.text("location").notNull(),
  roverId: t
    .uuid("rover_id")
    .references(() => rovers.id, { onDelete: "cascade" })
    .notNull(),
  result: t.text("result").notNull(),
  featured: t.boolean("featured").default(false),
  image: t.text("image").notNull(),
  iconColor: t.varchar("icon_color").notNull(),
  iconBg: t.varchar("icon_bg").notNull(),
  icon: t.varchar("icon").notNull(),
  highlights: t
    .text("highlight")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  year: t
    .timestamp("participation_year", {
      withTimezone: true,
      mode: "date",
    })
    .notNull(),
  score: t.varchar("score"),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type CompetitionsInsert = typeof competitions.$inferInsert;
export type CompetitionsSelect = typeof competitions.$inferSelect;

export const competitionsRelations = relations(
  competitions,
  ({ one, many }) => ({
    rover: one(rovers, {
      fields: [competitions.roverId],
      references: [rovers.id],
    }),
    sponsors: many(sponsors),
    competitionMembers: many(competitionMembers),
  })
);
