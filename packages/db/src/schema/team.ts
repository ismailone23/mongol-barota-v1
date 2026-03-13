import { pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { competitions } from "./competitions";
import { relations } from "drizzle-orm";

export const subTeamKeys = [
  "LT",
  "FA",
  "MT",
  "ET",
  "ST",
  "ScT",
  "MgT",
  "CT",
] as const;

export const subTeamEnum = pgEnum("sub_team", subTeamKeys);
export type SubTeam = typeof subTeamKeys;

export const members = pgTable("members", (t) => ({
  id: t.uuid("id").notNull().defaultRandom().primaryKey().unique(),
  name: t.varchar("name", { length: 100 }).notNull(),
  role: t.varchar("role").notNull(),
  department: t.varchar("department").notNull(),
  image: t.text("image").notNull(),
  subTeam: subTeamEnum().notNull(),
  bio: t.text("bio"),
  title: t.text("title"),
  email: t.varchar("email"),
  phone: t.varchar("phone"),
  linkedin: t.varchar("linkedin"),
  github: t.varchar("github"),
  about: t.varchar("about"),
  createdAt: t
    .timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  joined: t.timestamp("joined", { mode: "date" }),
  left: t.timestamp("left", { mode: "date" }),
}));

export type MemberInsert = typeof members.$inferInsert;
export type MemberSelect = typeof members.$inferSelect;

// will be used when a new competition will be added
export const competitionMembers = pgTable(
  "competitions_members",
  (t) => ({
    teamMemberId: t
      .uuid("team_member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    competitionId: t
      .uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    role: t.varchar("role", { length: 100 }),
    createdAt: t
      .timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  }),
  (table) => [
    primaryKey({
      name: "competitions_members_pk",
      columns: [table.teamMemberId, table.competitionId],
    }),
  ],
);

// Relations
export const teamMemberRelations = relations(members, ({ many }) => ({
  competitionMembers: many(competitionMembers),
}));

export const competitionMembersRelations = relations(
  competitionMembers,
  ({ one }) => ({
    teamMember: one(members, {
      fields: [competitionMembers.teamMemberId],
      references: [members.id],
    }),
    competition: one(competitions, {
      fields: [competitionMembers.competitionId],
      references: [competitions.id],
    }),
  }),
);
