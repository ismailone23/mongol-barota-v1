import {
  CreateSiteContentSchema,
  UpdateSiteContentSchema,
  CreateTimelineEventSchema,
  UpdateTimelineEventSchema,
  CreateContentItemSchema,
  UpdateContentItemSchema,
  ContentSectionEnum,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  siteContent,
  timelineEvents,
  contentItems,
} from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import * as z from "zod";
import { TRPCError } from "@trpc/server";

export const contentRoute = createTRPCRouter({
  // ─── Site Content (key-value) ───
  getSiteContent: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(siteContent)
      .orderBy(asc(siteContent.key));
  }),

  getSiteContentByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const [content] = await ctx.db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, input.key));
      return content ?? null;
    }),

  getSiteContentByKeys: publicProcedure
    .input(z.object({ keys: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const all = await ctx.db.select().from(siteContent);
      const map: Record<string, (typeof all)[number]> = {};
      for (const item of all) {
        if (input.keys.includes(item.key)) {
          map[item.key] = item;
        }
      }
      return map;
    }),

  upsertSiteContent: protectedProcedure
    .input(CreateSiteContentSchema)
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, input.key));

      if (existing) {
        const [updated] = await ctx.db
          .update(siteContent)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(siteContent.key, input.key))
          .returning();
        return { content: updated, message: "Content updated successfully" };
      }

      const [created] = await ctx.db
        .insert(siteContent)
        .values(input)
        .returning();
      return { content: created, message: "Content created successfully" };
    }),

  deleteSiteContent: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(siteContent)
        .where(eq(siteContent.id, input.id))
        .returning();
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Content not found",
        });
      }
      return { message: "Content deleted successfully" };
    }),

  // ─── Timeline Events ───
  getTimelineEvents: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(timelineEvents)
      .where(eq(timelineEvents.isActive, true))
      .orderBy(asc(timelineEvents.displayOrder));
  }),

  getAllTimelineEvents: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(timelineEvents)
      .orderBy(asc(timelineEvents.displayOrder));
  }),

  createTimelineEvent: protectedProcedure
    .input(CreateTimelineEventSchema)
    .mutation(async ({ ctx, input }) => {
      const [event] = await ctx.db
        .insert(timelineEvents)
        .values(input)
        .returning();
      if (!event) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create timeline event",
        });
      }
      return { event, message: "Timeline event created successfully" };
    }),

  updateTimelineEvent: protectedProcedure
    .input(UpdateTimelineEventSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(timelineEvents)
        .set(data)
        .where(eq(timelineEvents.id, id))
        .returning();
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timeline event not found",
        });
      }
      return { event: updated, message: "Timeline event updated successfully" };
    }),

  deleteTimelineEvent: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(timelineEvents)
        .where(eq(timelineEvents.id, input.id))
        .returning();
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timeline event not found",
        });
      }
      return { message: "Timeline event deleted successfully" };
    }),

  // ─── Content Items (generic sections) ───
  getContentItems: publicProcedure
    .input(z.object({ section: ContentSectionEnum }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(contentItems)
        .where(eq(contentItems.section, input.section))
        .orderBy(asc(contentItems.displayOrder));
    }),

  getActiveContentItems: publicProcedure
    .input(z.object({ section: ContentSectionEnum }))
    .query(async ({ ctx, input }) => {
      const { and } = await import("drizzle-orm");
      return await ctx.db
        .select()
        .from(contentItems)
        .where(
          and(
            eq(contentItems.section, input.section),
            eq(contentItems.isActive, true),
          ),
        )
        .orderBy(asc(contentItems.displayOrder));
    }),

  getAllContentItems: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(contentItems)
      .orderBy(asc(contentItems.section), asc(contentItems.displayOrder));
  }),

  createContentItem: protectedProcedure
    .input(CreateContentItemSchema)
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .insert(contentItems)
        .values(input)
        .returning();
      if (!item) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create content item",
        });
      }
      return { item, message: "Content item created successfully" };
    }),

  updateContentItem: protectedProcedure
    .input(UpdateContentItemSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(contentItems)
        .set(data)
        .where(eq(contentItems.id, id))
        .returning();
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Content item not found",
        });
      }
      return { item: updated, message: "Content item updated successfully" };
    }),

  deleteContentItem: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(contentItems)
        .where(eq(contentItems.id, input.id))
        .returning();
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Content item not found",
        });
      }
      return { message: "Content item deleted successfully" };
    }),
});
