import {
  CreateResearchPaperSchema,
  UpdateResearchPaperSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { researchPapers } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import * as z from "zod";

export const researchRoute = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(researchPapers)
      .orderBy(asc(researchPapers.displayOrder));
  }),

  getActive: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(researchPapers)
      .where(eq(researchPapers.isActive, true))
      .orderBy(asc(researchPapers.displayOrder));
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [paper] = await ctx.db
        .select()
        .from(researchPapers)
        .where(eq(researchPapers.id, input.id));
      return paper ?? null;
    }),

  create: protectedProcedure
    .input(CreateResearchPaperSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(researchPapers)
        .values(input)
        .returning();
      return created;
    }),

  update: protectedProcedure
    .input(UpdateResearchPaperSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(researchPapers)
        .set(data)
        .where(eq(researchPapers.id, id))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(researchPapers)
        .where(eq(researchPapers.id, input.id));
      return { success: true };
    }),
});
