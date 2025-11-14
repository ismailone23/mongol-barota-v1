import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { participatedCompetitions } from "./competitions";

export const sponsorshipPlans = pgTable("sponsorship_plans", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  name: t.varchar("name", { length: 100 }).notNull(),
  subtitle: t.varchar("subtitle", { length: 100 }),
  price: t.integer("price").notNull(),
  priceLabel: t.varchar("price_label", { length: 100 }),
  iconType: t.varchar("icon_type", { length: 50 }).notNull(),
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

export type SponsorshipPlans = typeof sponsorshipPlans.$inferSelect;

export const sponsors = pgTable("sponsor", (t) => ({
  sponsorId: t
    .uuid("sponsor_id")
    .notNull()
    .defaultRandom()
    .primaryKey()
    .unique(),
  sponsorCompanyName: t.varchar("sponsor_company_name").notNull(),
  sponsorCompanyDesctiption: t.text("sponsor_company_desctiption").notNull(),
  sponsorCompanyWebsite: t.text("sponsor_company_website").notNull(),
  sponsorCompanylogo: t.text("sponsor_company_logo").notNull(),
  sponsorshipPlan: t
    .uuid("sponsorship_plan")
    .notNull()
    .references(() => sponsorshipPlans.id, { onDelete: "cascade" }),
  competitionId: t
    .uuid("competition_id")
    .references(() => participatedCompetitions.id, { onDelete: "cascade" }),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export type Sponsors = typeof sponsors.$inferSelect;

export const sponsorCompetitionRelation = relations(sponsors, ({ one }) => ({
  competition: one(participatedCompetitions, {
    fields: [sponsors.competitionId],
    references: [participatedCompetitions.id],
  }),
  plan: one(sponsorshipPlans, {
    fields: [sponsors.sponsorshipPlan],
    references: [sponsorshipPlans.id],
  }),
}));

export const sponsorShipPlanRelation = relations(
  sponsorshipPlans,
  ({ many }) => ({
    sponsors: many(sponsors),
  })
);
