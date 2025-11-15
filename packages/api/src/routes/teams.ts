import {
  CreateSponsorSchema,
  CreateSponsorshipPlanSchema,
  CreateTeamMemberSchema,
  MemberAt,
  UpdateSponsorSchema,
  UpdateSponsorshipPlanSchema,
  UpdateTeamMemberSchema,
} from "../schema/auth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  participatedCompetitions,
  sponsors,
  sponsorshipPlans,
  teamMembers,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { TRPCError } from "@trpc/server";

export const teamRoute = createTRPCRouter({
  getAllteams: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(teamMembers);
  }),
  getSpecificMember: publicProcedure
    .input(
      z.object({
        memberAt: MemberAt,
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.memberAt, input.memberAt));
    }),
  createMember: protectedProcedure
    .input(CreateTeamMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const newMember = await ctx.db
        .insert(teamMembers)
        .values(input)
        .returning();
      if (!newMember) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
      return { newMember, message: "New member Added" };
    }),

  updateMember: protectedProcedure
    .input(UpdateTeamMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const newMember = await ctx.db
        .update(teamMembers)
        .set(data)
        .where(eq(teamMembers.id, id))
        .returning();
      if (!newMember) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
      return { newMember, message: "New member Added" };
    }),
  deleteMember: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleteUser] = await ctx.db
        .delete(teamMembers)
        .where(eq(teamMembers.id, input.id))
        .returning();
      if (!deleteUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Server error",
        });
      }
      return { message: "Member Removed" };
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
