import {
  CreateRecruitmentOpeningSchema,
  UpdateRecruitmentOpeningSchema,
  CreateFaqSchema,
  UpdateFaqSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { recruitmentOpenings, faqs } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import * as z from "zod";

export const joinRoute = createTRPCRouter({
  // ─── Recruitment Openings ───
  getOpenings: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(recruitmentOpenings)
      .where(eq(recruitmentOpenings.isActive, true))
      .orderBy(asc(recruitmentOpenings.displayOrder));
  }),

  getAllOpenings: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(recruitmentOpenings)
      .orderBy(asc(recruitmentOpenings.displayOrder));
  }),

  createOpening: protectedProcedure
    .input(CreateRecruitmentOpeningSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(recruitmentOpenings)
        .values(input)
        .returning();
      return created;
    }),

  updateOpening: protectedProcedure
    .input(UpdateRecruitmentOpeningSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(recruitmentOpenings)
        .set(data)
        .where(eq(recruitmentOpenings.id, id))
        .returning();
      return updated;
    }),

  deleteOpening: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(recruitmentOpenings)
        .where(eq(recruitmentOpenings.id, input.id));
      return { success: true };
    }),

  // ─── FAQs ───
  getFaqs: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      if (input?.category) {
        return await ctx.db
          .select()
          .from(faqs)
          .where(eq(faqs.category, input.category))
          .orderBy(asc(faqs.displayOrder));
      }
      return await ctx.db
        .select()
        .from(faqs)
        .where(eq(faqs.isActive, true))
        .orderBy(asc(faqs.displayOrder));
    }),

  getAllFaqs: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(faqs).orderBy(asc(faqs.displayOrder));
  }),

  createFaq: protectedProcedure
    .input(CreateFaqSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db.insert(faqs).values(input).returning();
      return created;
    }),

  updateFaq: protectedProcedure
    .input(UpdateFaqSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(faqs)
        .set(data)
        .where(eq(faqs.id, id))
        .returning();
      return updated;
    }),

  deleteFaq: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(faqs).where(eq(faqs.id, input.id));
      return { success: true };
    }),
});
