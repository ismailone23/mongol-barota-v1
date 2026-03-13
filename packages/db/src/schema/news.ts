import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

export const newsArticles = pgTable("news_articles", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  slug: t.varchar("slug", { length: 200 }).notNull().unique(),
  title: t.text("title").notNull(),
  excerpt: t.text("excerpt").notNull(),
  body: t.text("body"),
  category: t.varchar("category", { length: 100 }).notNull(),
  image: t.text("image"),
  images: t
    .jsonb("images")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  publishedAt: t
    .timestamp("published_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  isPublished: t.boolean("is_published").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type NewsArticleSelect = typeof newsArticles.$inferSelect;
export type NewsArticleInsert = typeof newsArticles.$inferInsert;
