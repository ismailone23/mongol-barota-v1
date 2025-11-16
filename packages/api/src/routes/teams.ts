import {
  CreateSponsorSchema,
  CreateSponsorshipPlanSchema,
  CreateTeamMemberSchema,
  memberAtEnum,
  UpdateSponsorSchema,
  UpdateSponsorshipPlanSchema,
  UpdateTeamMemberSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  participatedCompetitions,
  sponsors,
  sponsorshipPlans,
  teamMembers,
} from "@workspace/db/schema";
import { eq, desc, or, isNull, gte, asc } from "drizzle-orm";
import * as z from "zod";
import { TRPCError } from "@trpc/server";

export const teamRoute = createTRPCRouter({
  getAllMembers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().nullish().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const cursor = input.cursor ?? 0;

      const members = await ctx.db
        .select()
        .from(teamMembers)
        .where(
          or(isNull(teamMembers.until), gte(teamMembers.until, new Date()))
        )
        .orderBy(desc(teamMembers.from))
        .limit(limit + 1)
        .offset(cursor);

      let nextCursor: number | undefined = undefined;
      if (members.length > limit) {
        members.pop(); // Remove extra item
        nextCursor = cursor + limit;
      }

      return {
        members,
        nextCursor,
      };
    }),
  // Get all members (simple)
  getMembers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(teamMembers)
      .orderBy(desc(teamMembers.from));
  }),

  // Get single member
  getMember: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [member] = await ctx.db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.id, input.id));

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      return member;
    }),

  // Get members by type
  getMembersByType: publicProcedure
    .input(z.object({ memberAt: memberAtEnum }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.memberAt, input.memberAt))
        .orderBy(asc(teamMembers.name));
    }),

  // Create member
  createMember: protectedProcedure
    .input(CreateTeamMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const [newMember] = await ctx.db
        .insert(teamMembers)
        .values(input)
        .returning();

      if (!newMember) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create member",
        });
      }

      return { newMember, message: "New member added successfully" };
    }),

  // Update member
  updateMember: protectedProcedure
    .input(UpdateTeamMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updatedMember] = await ctx.db
        .update(teamMembers)
        .set(data)
        .where(eq(teamMembers.id, id))
        .returning();

      if (!updatedMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      return { updatedMember, message: "Member updated successfully" };
    }),

  // Delete member
  deleteMember: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedMember] = await ctx.db
        .delete(teamMembers)
        .where(eq(teamMembers.id, input.id))
        .returning();

      if (!deletedMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      return { message: "Member deleted successfully" };
    }),

  createSponsorshipPlan: protectedProcedure
    .input(CreateSponsorshipPlanSchema)
    .mutation(async ({ ctx, input }) => {
      const [plan] = await ctx.db
        .insert(sponsorshipPlans)
        .values(input)
        .returning();

      if (!plan) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create sponsorship plan",
        });
      }

      return { plan, message: "Sponsorship plan created successfully" };
    }),

  // Update
  updateSponsorshipPlan: protectedProcedure
    .input(UpdateSponsorshipPlanSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updatedPlan] = await ctx.db
        .update(sponsorshipPlans)
        .set({
          ...data,
          updatedAt: new Date(), // Update the timestamp
        })
        .where(eq(sponsorshipPlans.id, id))
        .returning();

      if (!updatedPlan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsorship plan not found",
        });
      }

      return { updatedPlan, message: "Sponsorship plan updated successfully" };
    }),

  deleteSponsorshipPlan: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedPlan] = await ctx.db
        .delete(sponsorshipPlans)
        .where(eq(sponsorshipPlans.id, input.id))
        .returning();

      if (!deletedPlan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsorship plan not found",
        });
      }

      return { message: "Sponsorship plan deleted successfully" };
    }),

  getSponsorshipPlans: publicProcedure.query(async ({ ctx }) => {
    const plans = await ctx.db
      .select()
      .from(sponsorshipPlans)
      .orderBy(sponsorshipPlans.displayOrder);

    return plans;
  }),
  getAllSponsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(sponsors);
  }),
  createSponsor: protectedProcedure
    .input(CreateSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      const [sponsor] = await ctx.db.insert(sponsors).values(input).returning();

      if (!sponsor) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create sponsor",
        });
      }

      return { sponsor, message: "Sponsor created successfully" };
    }),

  // Update Sponsor
  updateSponsor: protectedProcedure
    .input(UpdateSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      const { sponsorId, ...data } = input;

      const [updatedSponsor] = await ctx.db
        .update(sponsors)
        .set(data)
        .where(eq(sponsors.sponsorId, sponsorId))
        .returning();

      if (!updatedSponsor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsor not found",
        });
      }

      return { updatedSponsor, message: "Sponsor updated successfully" };
    }),

  // Delete Sponsor
  deleteSponsor: protectedProcedure
    .input(z.object({ sponsorId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedSponsor] = await ctx.db
        .delete(sponsors)
        .where(eq(sponsors.sponsorId, input.sponsorId))
        .returning();

      if (!deletedSponsor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsor not found",
        });
      }

      return { message: "Sponsor deleted successfully" };
    }),

  // Get All Sponsors
  getSponsors: publicProcedure.query(async ({ ctx }) => {
    const allSponsors = await ctx.db
      .select()
      .from(sponsors)
      .orderBy(sponsors.createdAt);

    return allSponsors;
  }),

  // Get Single Sponsor
  getSponsor: publicProcedure
    .input(z.object({ sponsorId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [sponsor] = await ctx.db
        .select()
        .from(sponsors)
        .where(eq(sponsors.sponsorId, input.sponsorId));

      if (!sponsor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsor not found",
        });
      }

      return sponsor;
    }),

  getSponsorsByCompetition: publicProcedure
    .input(z.object({ competitionId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const competitionSponsors = await ctx.db
        .select()
        .from(sponsors)
        .where(eq(sponsors.competitionId, input.competitionId))
        .orderBy(sponsors.createdAt);

      return competitionSponsors;
    }),

  getSponsorsByPlan: publicProcedure
    .input(z.object({ sponsorshipPlan: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const planSponsors = await ctx.db
        .select()
        .from(sponsors)
        .where(eq(sponsors.sponsorshipPlan, input.sponsorshipPlan))
        .orderBy(sponsors.createdAt);

      return planSponsors;
    }),

  getSponsorsWithRelations: publicProcedure.query(async ({ ctx }) => {
    const sponsorsWithRelations = await ctx.db
      .select({
        sponsor: sponsors,
        plan: sponsorshipPlans,
        competition: participatedCompetitions,
      })
      .from(sponsors)
      .leftJoin(
        sponsorshipPlans,
        eq(sponsors.sponsorshipPlan, sponsorshipPlans.id)
      )
      .leftJoin(
        participatedCompetitions,
        eq(sponsors.competitionId, participatedCompetitions.id)
      )
      .orderBy(sponsors.createdAt);

    return sponsorsWithRelations;
  }),
});
