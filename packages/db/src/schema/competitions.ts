import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { sponsors } from "./sponsots";
import { teamMemberCompetitions } from "./team";
import { rovers } from "./rovers";

export const competitionRegion = pgTable("competition_region", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  competitionRegionName: t
    .text("competition_region_name", {
      enum: [
        "University Rover Challenge",
        "Anatolian Rover Challenge",
        "European Rover Challenge",
      ],
    })
    .notNull(),
  competitionDesciption: t.text("competition_desciption").notNull(),
  competitionLocation: t.text("competition_location").notNull(),
  competitionOrganizer: t.varchar("competition_organizer").notNull(),
  organizerWebsite: t.text("organizer_website").notNull(),
  createdAt: t
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  image: t.text("image").notNull(),
}));

export type CompetitionRegion = typeof competitionRegion.$inferSelect;

export const participatedCompetitions = pgTable(
  "participated_competition",
  (t) => ({
    id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
    competitionRegionId: t
      .uuid("competition_region_id")
      .notNull()
      .references(() => competitionRegion.id, { onDelete: "cascade" }),
    competitionName: t.text("competition_name").notNull(),
    competitionDescription: t.text("competition_description").notNull(),
    location: t.text("competition_location").notNull(),
    roverId: t
      .uuid("rover_id")
      .references(() => rovers.id, { onDelete: "cascade" })
      .notNull(),
    competitionResult: t.text("competition_result").notNull(),
    featured: t.boolean("featured").default(false),
    image: t.text("image").notNull(),
    color: t.varchar("color").notNull(),
    bgColor: t.varchar("bg_color").notNull(),
    icon: t.varchar("icon").notNull(),
    highlights: t
      .text("competition_highlight")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    participationYear: t
      .timestamp("participation_year", {
        withTimezone: true,
        mode: "date",
      })
      .notNull(),
    createdAt: t
      .timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  })
);

export type ParticipatedCompetitions =
  typeof participatedCompetitions.$inferSelect;

// ============= RELATIONS =============

export const competitionRegionMissionRelation = relations(
  competitionRegion,
  ({ many }) => ({
    competitions: many(participatedCompetitions),
  })
);

export const participatedCompetitionsRelations = relations(
  participatedCompetitions,
  ({ one, many }) => ({
    region: one(competitionRegion, {
      fields: [participatedCompetitions.competitionRegionId],
      references: [competitionRegion.id],
    }),
    rover: one(rovers, {
      fields: [participatedCompetitions.roverId],
      references: [rovers.id],
    }),
    sponsors: many(sponsors),
    teamMemberCompetitions: many(teamMemberCompetitions),
  })
);
