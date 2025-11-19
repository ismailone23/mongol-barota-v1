import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  competitions,
  CompetitionsSelect,
  rovers,
  competitionMembers,
  members,
  MemberSelect,
  RoversSelect,
} from "@workspace/db/schema";
import { and, desc, eq, gte, isNull, or } from "drizzle-orm";
import * as z from "zod";
import {
  CreateCompetitionSchema,
  CreateRoverSchema,
  RegionEnum,
  UpdateCompetitionSchema,
  UpdateRoverSchema,
} from "@workspace/types";

export const competitionRoute = createTRPCRouter({
  createCompetition: protectedProcedure
    .input(CreateCompetitionSchema)
    .mutation(async ({ ctx, input }) => {
      const { teamMemberIds, ...competitionData } = input;

      const [competition] = await ctx.db
        .insert(competitions)
        .values(competitionData)
        .returning();

      if (!competition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create competition",
        });
      }

      if (teamMemberIds && teamMemberIds.length > 0) {
        const memberEntries = teamMemberIds.map((memberId) => ({
          competitionId: competition.id,
          teamMemberId: memberId,
        }));

        await ctx.db
          .insert(competitionMembers)
          .values(memberEntries)
          .onConflictDoNothing();
      }

      return { competition, message: "Competition created successfully" };
    }),

  updateCompetition: protectedProcedure
    .input(UpdateCompetitionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, teamMemberIds, ...data } = input;

      const [updatedCompetition] = await ctx.db
        .update(competitions)
        .set(data)
        .where(eq(competitions.id, id))
        .returning();

      if (!updatedCompetition) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Competition not found",
        });
      }

      if (teamMemberIds !== undefined) {
        await ctx.db
          .delete(competitionMembers)
          .where(eq(competitionMembers.competitionId, id));

        if (teamMemberIds.length > 0) {
          const memberEntries = teamMemberIds.map((memberId) => ({
            competitionId: id,
            teamMemberId: memberId,
          }));

          await ctx.db
            .insert(competitionMembers)
            .values(memberEntries)
            .onConflictDoNothing();
        }
      }

      return {
        updatedCompetition,
        message: "Competition updated successfully",
      };
    }),

  deleteCompetition: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedCompetition] = await ctx.db
        .delete(competitions)
        .where(eq(competitions.id, input.id))
        .returning();

      if (!deletedCompetition) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Competition not found",
        });
      }

      return { message: "Competition deleted successfully" };
    }),

  getCompetitions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(competitions)
      .orderBy(desc(competitions.year));
  }),

  getCompetitionWithMembers: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [competition] = await ctx.db
        .select()
        .from(competitions)
        .where(eq(competitions.id, input.id));

      if (!competition) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Competition not found",
        });
      }

      // Then get all team members for this competition
      const currentMembers = await ctx.db
        .select({
          member: members,
        })
        .from(competitionMembers)
        .innerJoin(members, eq(competitionMembers.teamMemberId, members.id))
        .where(eq(competitionMembers.competitionId, input.id));

      return {
        ...competition,
        competitionMembers: currentMembers.map((m) => ({
          competitionId: input.id,
          teamMember: m.member,
        })),
      };
    }),
  // Get Single Competition
  getCompetition: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [competition] = await ctx.db
        .select()
        .from(competitions)
        .where(eq(competitions.id, input.id));

      if (!competition) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Competition not found",
        });
      }

      return competition;
    }),

  // Get Competitions by Region
  getCompetitionsByRegion: publicProcedure
    .input(
      z.object({
        region: RegionEnum,
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(competitions)
        .where(eq(competitions.region, input.region))
        .orderBy(desc(competitions.year));
    }),

  // Get Competitions by Rover
  getCompetitionsByRover: publicProcedure
    .input(z.object({ roverId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const competition = await ctx.db
        .select()
        .from(competitions)
        .where(eq(competitions.roverId, input.roverId))
        .orderBy(desc(competitions.year));

      return competition;
    }),

  getFullCompetitionData: publicProcedure.query(async ({ ctx }) => {
    // each row will contain competition, rover and a single member (if any)
    const rows = await ctx.db
      .select({
        competition: competitions,
        rover: rovers,
        member: members,
        competitionId: competitionMembers.competitionId,
      })
      .from(competitionMembers)
      .innerJoin(
        competitions,
        eq(competitions.id, competitionMembers.competitionId)
      )
      .innerJoin(members, eq(members.id, competitionMembers.teamMemberId))
      .innerJoin(rovers, eq(competitions.roverId, rovers.id))
      .orderBy(desc(competitions.year));

    const map = new Map<
      string,
      {
        competition: CompetitionsSelect;
        rover: RoversSelect;
        members: MemberSelect[];
      }
    >();

    for (const r of rows) {
      const id = r.competitionId;
      if (!map.has(id)) {
        map.set(id, {
          competition: r.competition,
          rover: r.rover,
          members: [],
        });
      }
      map.get(id)!.members.push(r.member);
    }

    // preserve order from the query by iterating rows and keeping insertion order
    const result: {
      competition: CompetitionsSelect;
      rover: RoversSelect;
      members: MemberSelect[];
    }[] = [];

    for (const [, value] of map) result.push(value);

    return result;
  }),

  // Get Competition Statistics
  getCompetitionStats: publicProcedure.query(async ({ ctx }) => {
    const allCompetitions = await ctx.db.select().from(competitions);

    const stats = {
      total: allCompetitions.length,
      featured: allCompetitions.filter((c) => c.featured).length,
      byRegion: {
        URC: allCompetitions.filter((c) => c.region === "urc").length,
        ARC: allCompetitions.filter((c) => c.region === "arc").length,
        ERC: allCompetitions.filter((c) => c.region === "erc").length,
      },
      latestYear:
        allCompetitions.length > 0
          ? Math.max(...allCompetitions.map((c) => c.year.getFullYear()))
          : null,
    };

    return stats;
  }),
  createRover: protectedProcedure
    .input(CreateRoverSchema)
    .mutation(async ({ ctx, input }) => {
      const [rover] = await ctx.db.insert(rovers).values(input).returning();

      if (!rover) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create rover",
        });
      }

      return { rover, message: "Rover created successfully" };
    }),

  updateRover: protectedProcedure
    .input(UpdateRoverSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updatedRover] = await ctx.db
        .update(rovers)
        .set(data)
        .where(eq(rovers.id, id))
        .returning();

      if (!updatedRover) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rover not found",
        });
      }

      return { updatedRover, message: "Rover updated successfully" };
    }),

  // Delete Rover
  deleteRover: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedRover] = await ctx.db
        .delete(rovers)
        .where(eq(rovers.id, input.id))
        .returning();

      if (!deletedRover) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rover not found",
        });
      }

      return { message: "Rover deleted successfully" };
    }),

  // Get All Rovers
  getRovers: publicProcedure.query(async ({ ctx }) => {
    const allRovers = await ctx.db
      .select()
      .from(rovers)
      .orderBy(desc(rovers.year));

    return allRovers;
  }),

  // Get Single Rover
  getRover: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [rover] = await ctx.db
        .select()
        .from(rovers)
        .where(eq(rovers.id, input.id));

      if (!rover) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rover not found",
        });
      }

      return rover;
    }),

  getActiveRovers: publicProcedure.query(async ({ ctx }) => {
    const activeRovers = await ctx.db
      .select()
      .from(rovers)
      .where(or(isNull(rovers.ended), gte(rovers.ended, new Date())))
      .orderBy(rovers.year);

    return activeRovers;
  }),
});
