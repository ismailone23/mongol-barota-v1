import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

// Sub-team recruitment openings
export const recruitmentOpenings = pgTable("recruitment_openings", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  teamName: t.varchar("team_name", { length: 100 }).notNull(),
  description: t.text("description").notNull(),
  skills: t
    .jsonb("skills")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  openPositions: t.integer("open_positions").notNull().default(0),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type RecruitmentOpeningSelect = typeof recruitmentOpenings.$inferSelect;
export type RecruitmentOpeningInsert = typeof recruitmentOpenings.$inferInsert;

// FAQs (used on join page and potentially elsewhere)
export const faqs = pgTable("faqs", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  question: t.text("question").notNull(),
  answer: t.text("answer").notNull(),
  category: t.varchar("category", { length: 100 }),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type FaqSelect = typeof faqs.$inferSelect;
export type FaqInsert = typeof faqs.$inferInsert;
