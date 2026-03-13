import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

// Key-value content for page sections (mission, vision, about text, hero text, etc.)
export const siteContent = pgTable("site_content", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  key: t.varchar("key", { length: 100 }).notNull().unique(),
  title: t.text("title"),
  body: t.text("body").notNull(),
  image: t.text("image"),
  metadata: t
    .jsonb("metadata")
    .$type<Record<string, string>>()
    .default(sql`'{}'::jsonb`),
  updatedAt: t
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type SiteContentSelect = typeof siteContent.$inferSelect;
export type SiteContentInsert = typeof siteContent.$inferInsert;

// Timeline milestones (about page history, etc.)
export const timelineEvents = pgTable("timeline_events", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  year: t.varchar("year", { length: 10 }).notNull(),
  title: t.text("title").notNull(),
  description: t.text("description").notNull(),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type TimelineEventSelect = typeof timelineEvents.$inferSelect;
export type TimelineEventInsert = typeof timelineEvents.$inferInsert;

// Generic content items for various sections
// section values: core_value, sponsorship_benefit, contact_person, social_link, stat_card, hero_highlight
export const contentItems = pgTable("content_items", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  section: t.varchar("section", { length: 50 }).notNull(),
  title: t.text("title").notNull(),
  subtitle: t.text("subtitle"),
  description: t.text("description"),
  icon: t.varchar("icon", { length: 50 }),
  iconColor: t.varchar("icon_color", { length: 50 }),
  url: t.text("url"),
  email: t.varchar("email", { length: 255 }),
  phone: t.varchar("phone", { length: 50 }),
  image: t.text("image"),
  category: t.varchar("category", { length: 100 }),
  metadata: t
    .jsonb("metadata")
    .$type<Record<string, string>>()
    .default(sql`'{}'::jsonb`),
  displayOrder: t.integer("display_order").notNull().default(0),
  isActive: t.boolean("is_active").notNull().default(true),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type ContentItemSelect = typeof contentItems.$inferSelect;
export type ContentItemInsert = typeof contentItems.$inferInsert;
