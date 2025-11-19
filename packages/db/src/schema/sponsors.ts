import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { competitions } from "./competitions";

export const plans = pgTable("plans", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  name: t.varchar("name", { length: 100 }).notNull(),
  subtitle: t.varchar("subtitle", { length: 100 }),
  price: t.integer("price").notNull(),
  priceLabel: t.varchar("price_label", { length: 100 }),
  icon: t.varchar("icon", { length: 50 }).notNull(),
  iconColor: t.varchar("icon_color", { length: 50 }).notNull(),
  iconBgColor: t.varchar("icon_bg_color", { length: 50 }).notNull(),
  borderColor: t.varchar("border_color", { length: 50 }),
  isPopular: t.boolean("is_popular").default(false),
  displayOrder: t.integer("display_order").notNull().default(0),
  benefits: t
    .text("benefits")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  isActive: t.boolean("is_active").default(true).notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
}));

export type PlansSelect = typeof plans.$inferSelect;
export type PlansInsert = typeof plans.$inferInsert;

export const sponsors = pgTable("sponsors", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  name: t.varchar("name").notNull(),
  desctiption: t.text("desctiption").notNull(),
  website: t.text("website").notNull(),
  logo: t.text("logo").notNull(),
  plan: t
    .uuid("plan")
    .notNull()
    .references(() => plans.id, { onDelete: "no action" }),
  competitionId: t
    .uuid("competition_id")
    .notNull()
    .references(() => competitions.id, { onDelete: "no action" }),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type Sponsors = typeof sponsors.$inferSelect;

export const sponsorCompetitionRelation = relations(sponsors, ({ one }) => ({
  competition: one(competitions, {
    fields: [sponsors.competitionId],
    references: [competitions.id],
  }),
  plan: one(plans, {
    fields: [sponsors.plan],
    references: [plans.id],
  }),
}));

export const sponssrShipPlanRelation = relations(plans, ({ many }) => ({
  sponsors: many(sponsors),
}));
