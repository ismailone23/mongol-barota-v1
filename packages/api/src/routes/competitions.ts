import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  participatedCompetitions,
  rovers,
  sponsors,
  teamMemberCompetitions,
  teamMembers,
} from "@workspace/db/schema";
import { desc, eq, gte, isNull, or } from "drizzle-orm";
import * as z from "zod";
import {
  competitionRegions,
  CreateCompetitionSchema,
  CreateRoverSchema,
  UpdateCompetitionSchema,
  UpdateRoverSchema,
} from "@workspace/types";

export const competitionRoute = createTRPCRouter({
  createCompetition: protectedProcedure
    .input(CreateCompetitionSchema)
    .mutation(async ({ ctx, input }) => {
      const [competition] = await ctx.db
        .insert(participatedCompetitions)
        .values(input)
        .returning();

      if (!competition) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create competition",
        });
      }

      return { competition, message: "Competition created successfully" };
    }),

  updateCompetition: protectedProcedure
    .input(UpdateCompetitionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updatedCompetition] = await ctx.db
        .update(participatedCompetitions)
        .set(data)
        .where(eq(participatedCompetitions.id, id))
        .returning();

      if (!updatedCompetition) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Competition not found",
        });
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
        .delete(participatedCompetitions)
        .where(eq(participatedCompetitions.id, input.id))
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
    const competitions = await ctx.db
      .select()
      .from(participatedCompetitions)
      .orderBy(desc(participatedCompetitions.participationYear));

    return competitions;
  }),

  // Get Single Competition
  getCompetition: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [competition] = await ctx.db
        .select()
        .from(participatedCompetitions)
        .where(eq(participatedCompetitions.id, input.id));

      if (!competition) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Competition not found",
        });
      }

      return competition;
    }),

  // Get Featured Competitions
  getFeaturedCompetitions: publicProcedure.query(async ({ ctx }) => {
    const featuredCompetitions = await ctx.db
      .select()
      .from(participatedCompetitions)
      .where(eq(participatedCompetitions.featured, true))
      .orderBy(desc(participatedCompetitions.participationYear));

    return featuredCompetitions;
  }),

  // Get Competitions by Region
  getCompetitionsByRegion: publicProcedure
    .input(
      z.object({
        regionName: z.enum(competitionRegions),
      })
    )
    .query(async ({ ctx, input }) => {
      const competitions = await ctx.db
        .select()
        .from(participatedCompetitions)
        .where(
          eq(participatedCompetitions.competitionRegionName, input.regionName)
        )
        .orderBy(desc(participatedCompetitions.participationYear));

      return competitions;
    }),

  // Get Competitions by Rover
  getCompetitionsByRover: publicProcedure
    .input(z.object({ roverId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const competitions = await ctx.db
        .select()
        .from(participatedCompetitions)
        .where(eq(participatedCompetitions.roverId, input.roverId))
        .orderBy(desc(participatedCompetitions.participationYear));

      return competitions;
    }),

  // Get Competition with Relations (rover, sponsors, team members)
  getCompetitionWithRelations: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Get competition with rover
      const [competitionWithRover] = await ctx.db
        .select({
          competition: participatedCompetitions,
          rover: rovers,
        })
        .from(participatedCompetitions)
        .leftJoin(rovers, eq(participatedCompetitions.roverId, rovers.id))
        .where(eq(participatedCompetitions.id, input.id));

      if (!competitionWithRover) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Competition not found",
        });
      }

      // Get sponsors for this competition
      const competitionSponsors = await ctx.db
        .select()
        .from(sponsors)
        .where(eq(sponsors.competitionId, input.id));

      // Get team members for this competition
      const competitionTeamMembers = await ctx.db
        .select({
          teamMember: teamMembers,
          relation: teamMemberCompetitions,
        })
        .from(teamMemberCompetitions)
        .leftJoin(
          teamMembers,
          eq(teamMemberCompetitions.teamMemberId, teamMembers.id)
        )
        .where(eq(teamMemberCompetitions.competitionId, input.id));

      return {
        ...competitionWithRover.competition,
        rover: competitionWithRover.rover,
        sponsors: competitionSponsors,
        teamMembers: competitionTeamMembers.map((tm) => ({
          ...tm.teamMember,
          role: tm.relation.role,
        })),
      };
    }),

  // Get All Competitions with Rover Details
  getAllCompetitionsWithRovers: publicProcedure.query(async ({ ctx }) => {
    const competitions = await ctx.db
      .select({
        competition: participatedCompetitions,
        rover: rovers,
      })
      .from(participatedCompetitions)
      .leftJoin(rovers, eq(participatedCompetitions.roverId, rovers.id))
      .orderBy(desc(participatedCompetitions.participationYear));

    return competitions.map((c) => ({
      ...c.competition,
      rover: c.rover,
    }));
  }),

  // Get Competition Statistics
  getCompetitionStats: publicProcedure.query(async ({ ctx }) => {
    const allCompetitions = await ctx.db
      .select()
      .from(participatedCompetitions);

    const stats = {
      total: allCompetitions.length,
      featured: allCompetitions.filter((c) => c.featured).length,
      byRegion: {
        URC: allCompetitions.filter(
          (c) => c.competitionRegionName === "University Rover Challenge"
        ).length,
        ARC: allCompetitions.filter(
          (c) => c.competitionRegionName === "Anatolian Rover Challenge"
        ).length,
        ERC: allCompetitions.filter(
          (c) => c.competitionRegionName === "European Rover Challenge"
        ).length,
      },
      latestYear:
        allCompetitions.length > 0
          ? Math.max(
              ...allCompetitions.map((c) => c.participationYear.getFullYear())
            )
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

  // Update Rover
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
    const allRovers = await ctx.db.select().from(rovers).orderBy(rovers.from);

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

  // Get Active Rovers (where until is null or in the future)
  getActiveRovers: publicProcedure.query(async ({ ctx }) => {
    const activeRovers = await ctx.db
      .select()
      .from(rovers)
      .where(or(isNull(rovers.until), gte(rovers.until, new Date())))
      .orderBy(rovers.from);

    return activeRovers;
  }),
});
