import {
  CreateGalleryCategorySchema,
  UpdateGalleryCategorySchema,
  CreateGalleryImageSchema,
  UpdateGalleryImageSchema,
  CreateGalleryVideoSchema,
  UpdateGalleryVideoSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  galleryCategories,
  galleryImages,
  galleryVideos,
} from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import * as z from "zod";

export const galleryRoute = createTRPCRouter({
  // ─── Categories ───
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(galleryCategories)
      .where(eq(galleryCategories.isActive, true))
      .orderBy(asc(galleryCategories.displayOrder));
  }),

  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(galleryCategories)
      .orderBy(asc(galleryCategories.displayOrder));
  }),

  createCategory: protectedProcedure
    .input(CreateGalleryCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(galleryCategories)
        .values(input)
        .returning();
      return created;
    }),

  updateCategory: protectedProcedure
    .input(UpdateGalleryCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(galleryCategories)
        .set(data)
        .where(eq(galleryCategories.id, id))
        .returning();
      return updated;
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(galleryCategories)
        .where(eq(galleryCategories.id, input.id));
      return { success: true };
    }),

  // ─── Images ───
  getImages: publicProcedure
    .input(z.object({ categoryId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.categoryId, input.categoryId))
        .orderBy(asc(galleryImages.displayOrder));
    }),

  getAllImages: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.displayOrder));
  }),

  createImage: protectedProcedure
    .input(CreateGalleryImageSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(galleryImages)
        .values(input)
        .returning();
      return created;
    }),

  updateImage: protectedProcedure
    .input(UpdateGalleryImageSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(galleryImages)
        .set(data)
        .where(eq(galleryImages.id, id))
        .returning();
      return updated;
    }),

  deleteImage: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(galleryImages).where(eq(galleryImages.id, input.id));
      return { success: true };
    }),

  // ─── Videos ───
  getVideos: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(galleryVideos)
      .where(eq(galleryVideos.isActive, true))
      .orderBy(asc(galleryVideos.displayOrder));
  }),

  getAllVideos: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(galleryVideos)
      .orderBy(asc(galleryVideos.displayOrder));
  }),

  createVideo: protectedProcedure
    .input(CreateGalleryVideoSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(galleryVideos)
        .values(input)
        .returning();
      return created;
    }),

  updateVideo: protectedProcedure
    .input(UpdateGalleryVideoSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(galleryVideos)
        .set(data)
        .where(eq(galleryVideos.id, id))
        .returning();
      return updated;
    }),

  deleteVideo: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(galleryVideos).where(eq(galleryVideos.id, input.id));
      return { success: true };
    }),
});
