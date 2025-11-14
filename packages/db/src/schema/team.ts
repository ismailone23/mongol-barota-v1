import { pgTable } from "drizzle-orm/pg-core";
import { participatedCompetitions } from "./competitions";
import { relations } from "drizzle-orm";

export const teamMembers = pgTable("team_members", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(), // Changed to UUID
  image: t.text("image").notNull(),
  name: t.varchar("name", { length: 100 }).notNull(),
  designation: t.varchar("designation").notNull(),
  department: t.varchar("department").notNull(),
  memberAt: t
    .text("member_at", {
      enum: ["LT", "FA", "MT", "ET", "ST", "ScT", "MgT", "CT"],
    })
    .notNull(),
  description: t.text("description"),
  email: t.varchar("email"),
  phone: t.varchar("phone"),
  linkedin: t.varchar("linkedin"),
  github: t.varchar("github"),
  about: t.varchar("about").notNull(),
  createdAt: t
    .timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  from: t.timestamp("from", { mode: "date" }).defaultNow().notNull(),
  until: t.timestamp("until", { mode: "date" }),
}));

export type TeamMembers = typeof teamMembers.$inferSelect;

// ============= JUNCTION TABLE: Team Members <-> Competitions =============
// This is needed for many-to-many relationship
export const teamMemberCompetitions = pgTable(
  "team_member_competitions",
  (t) => ({
    teamMemberId: t
      .uuid("team_member_id")
      .notNull()
      .references(() => teamMembers.id, { onDelete: "cascade" }),
    competitionId: t
      .uuid("competition_id")
      .notNull()
      .references(() => participatedCompetitions.id, { onDelete: "cascade" }),
    role: t.varchar("role", { length: 100 }), // Optional: their role in this competition
    createdAt: t
      .timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  }),
  (table) => ({
    pk: {
      name: "team_member_competitions_pk",
      columns: [table.teamMemberId, table.competitionId],
    },
  })
);

// Relations
export const teamMemberRelations = relations(teamMembers, ({ many }) => ({
  teamMemberCompetitions: many(teamMemberCompetitions),
}));

export const teamMemberCompetitionsRelations = relations(
  teamMemberCompetitions,
  ({ one }) => ({
    teamMember: one(teamMembers, {
      fields: [teamMemberCompetitions.teamMemberId],
      references: [teamMembers.id],
    }),
    competition: one(participatedCompetitions, {
      fields: [teamMemberCompetitions.competitionId],
      references: [participatedCompetitions.id],
    }),
  })
);
