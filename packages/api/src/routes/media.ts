import {
  CreateMediaCoverageSchema,
  UpdateMediaCoverageSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { mediaCoverages } from "@workspace/db/schema";
import { eq, asc, and } from "drizzle-orm";
import * as z from "zod";

export const mediaRoute = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(mediaCoverages)
      .orderBy(asc(mediaCoverages.displayOrder));
  }),

  getActive: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(mediaCoverages)
      .where(eq(mediaCoverages.isActive, true))
      .orderBy(asc(mediaCoverages.displayOrder));
  }),

  getByYear: publicProcedure
    .input(z.object({ year: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(mediaCoverages)
        .where(
          and(
            eq(mediaCoverages.year, input.year),
            eq(mediaCoverages.isActive, true),
          ),
        )
        .orderBy(asc(mediaCoverages.displayOrder));
    }),

  create: protectedProcedure
    .input(CreateMediaCoverageSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(mediaCoverages)
        .values(input)
        .returning();
      return created;
    }),

  update: protectedProcedure
    .input(UpdateMediaCoverageSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(mediaCoverages)
        .set(data)
        .where(eq(mediaCoverages.id, id))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(mediaCoverages)
        .where(eq(mediaCoverages.id, input.id));
      return { success: true };
    }),
});
