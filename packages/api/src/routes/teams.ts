import {
  CreateSponsorSchema,
  CreatePlanSchema,
  UpdateSponsorSchema,
  SubTeamEnum,
  CreateMemberSchema,
  UpdateMemberSchema,
  UpdatePlanSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { competitions, sponsors, members, plans } from "@workspace/db/schema";
import { eq, desc, or, isNull, gte, asc } from "drizzle-orm";
import * as z from "zod";
import { TRPCError } from "@trpc/server";

export const teamRoute = createTRPCRouter({
  getPaginatedMembers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().nullish().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const cursor = input.cursor ?? 0;

      const currentMembers = await ctx.db
        .select()
        .from(members)
        .where(or(isNull(members.left), gte(members.left, new Date())))
        .orderBy(desc(members.joined))
        .limit(limit + 1)
        .offset(cursor);

      let nextCursor: number | undefined = undefined;
      if (currentMembers.length > limit) {
        currentMembers.pop();
        nextCursor = cursor + limit;
      }

      return {
        currentMembers,
        nextCursor,
      };
    }),

  getMembers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(members);
  }),

  getMember: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [member] = await ctx.db
        .select()
        .from(members)
        .where(eq(members.id, input.id));

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      return member;
    }),

  getSubTeamMembers: publicProcedure
    .input(z.object({ subTeam: SubTeamEnum }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(members)
        .where(eq(members.subTeam, input.subTeam))
        .orderBy(asc(members.name));
    }),

  createMember: protectedProcedure
    .input(CreateMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const [newMember] = await ctx.db
        .insert(members)
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

  updateMember: protectedProcedure
    .input(UpdateMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updatedMember] = await ctx.db
        .update(members)
        .set(data)
        .where(eq(members.id, id))
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
        .delete(members)
        .where(eq(members.id, input.id))
        .returning();

      if (!deletedMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team member not found",
        });
      }

      return { message: "Member deleted successfully" };
    }),

  createPlan: protectedProcedure
    .input(CreatePlanSchema)
    .mutation(async ({ ctx, input }) => {
      const [plan] = await ctx.db.insert(plans).values(input).returning();

      if (!plan) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create sponsorship plan",
        });
      }

      return { plan, message: "Sponsorship plan created successfully" };
    }),

  updatePlan: protectedProcedure
    .input(UpdatePlanSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updatedPlan] = await ctx.db
        .update(plans)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(plans.id, id))
        .returning();

      if (!updatedPlan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsorship plan not found",
        });
      }

      return { updatedPlan, message: "Sponsorship plan updated successfully" };
    }),

  deletePlan: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedPlan] = await ctx.db
        .delete(plans)
        .where(eq(plans.id, input.id))
        .returning();

      if (!deletedPlan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsorship plan not found",
        });
      }

      return { message: "Sponsorship plan deleted successfully" };
    }),

  getPlans: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(plans).orderBy(plans.displayOrder);
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

  updateSponsor: protectedProcedure
    .input(UpdateSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [updatedSponsor] = await ctx.db
        .update(sponsors)
        .set(data)
        .where(eq(sponsors.id, id))
        .returning();

      if (!updatedSponsor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsor not found",
        });
      }

      return { updatedSponsor, message: "Sponsor updated successfully" };
    }),

  deleteSponsor: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedSponsor] = await ctx.db
        .delete(sponsors)
        .where(eq(sponsors.id, input.id))
        .returning();

      if (!deletedSponsor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsor not found",
        });
      }

      return { message: "Sponsor deleted successfully" };
    }),

  getSponsors: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(sponsors)
      .orderBy(asc(sponsors.createdAt));
  }),

  getSponsor: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [sponsor] = await ctx.db
        .select()
        .from(sponsors)
        .where(eq(sponsors.id, input.id));

      if (!sponsor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sponsor not found",
        });
      }

      return sponsor;
    }),

  getSponsorsWithRelations: publicProcedure.query(async ({ ctx }) => {
    const sponsorsWithRelations = await ctx.db
      .select({
        sponsor: sponsors,
        plan: plans,
        competition: competitions,
      })
      .from(sponsors)
      .innerJoin(plans, eq(sponsors.plan, plans.id))
      .leftJoin(competitions, eq(sponsors.competitionId, competitions.id))
      .orderBy(sponsors.createdAt);

    return sponsorsWithRelations;
  }),
});
