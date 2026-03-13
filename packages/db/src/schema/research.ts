import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const researchPapers = pgTable("research_papers", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  title: t.text("title").notNull(),
  authors: t
    .jsonb("authors")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  journal: t.varchar("journal", { length: 200 }).notNull(),
  year: t.varchar("year", { length: 10 }).notNull(),
  doi: t.varchar("doi", { length: 200 }),
  url: t.text("url"),
  abstract: t.text("abstract"),
  keywords: t
    .jsonb("keywords")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  category: t.varchar("category", { length: 100 }).notNull(),
  venue: t.text("venue"),
  pages: t.varchar("pages", { length: 50 }),
  publisher: t.varchar("publisher", { length: 200 }),
  isOpenAccess: t.boolean("is_open_access").notNull().default(false),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type ResearchPaperSelect = typeof researchPapers.$inferSelect;
export type ResearchPaperInsert = typeof researchPapers.$inferInsert;
