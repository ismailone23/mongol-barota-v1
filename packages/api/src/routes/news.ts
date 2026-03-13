import {
  CreateNewsArticleSchema,
  UpdateNewsArticleSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { newsArticles } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import * as z from "zod";

export const newsRoute = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt));
  }),

  getPublished: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.isPublished, true))
      .orderBy(desc(newsArticles.publishedAt));
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [article] = await ctx.db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.slug, input.slug));
      return article ?? null;
    }),

  create: protectedProcedure
    .input(CreateNewsArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(newsArticles)
        .values(input)
        .returning();
      return created;
    }),

  update: protectedProcedure
    .input(UpdateNewsArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(newsArticles)
        .set(data)
        .where(eq(newsArticles.id, id))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(newsArticles).where(eq(newsArticles.id, input.id));
      return { success: true };
    }),
});
