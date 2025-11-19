import { RegisterSchema } from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { users } from "@workspace/db/schema";
import { asc, eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const authRoute = createTRPCRouter({
  registerUser: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const [isExists] = await ctx.db
        .select()
        .from(users)
        .where(
          or(eq(users.email, input.email), eq(users.mistId, input.mistid))
        );
      if (isExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists with same id or email!",
        });
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newEntry = await ctx.db
        .insert(users)
        .values({
          email: input.email,
          mistId: input.mistid,
          password: hashedPassword,
        })
        .returning();
      if (!newEntry) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong! Try again",
        });
      }
      return {
        newEntry,
        message: "User Created Successfully. Check email for verification.",
      };
    }),
  verifyUser: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const loggedInUser = ctx.session.user;
      if (loggedInUser.email) {
        const [currentUser] = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, loggedInUser.email));
        if (currentUser?.emailVerified) {
          const [toUpdate] = await ctx.db
            .update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.id, input.id))
            .returning();
          if (toUpdate) {
            return { toUpdate, message: "User verified" };
          }
        }
      }
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have rights to do this action",
      });
    }),
  deleteUser: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const loggedInUser = ctx.session.user;
      if (loggedInUser.email) {
        const [currentUser] = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, loggedInUser.email));
        if (currentUser?.id === input.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You cann't delete your account by yourself",
          });
        }
        const [deleteUser] = await ctx.db
          .delete(users)
          .where(eq(users.id, input.id))
          .returning();
        if (deleteUser) {
          return { deleteUser, message: "User deleted" };
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }),
  allUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(users).orderBy(asc(users.emailVerified));
  }),
  isActualUser: publicProcedure
    .input(z.object({ email: z.string().optional().nullable() }))
    .query(async ({ ctx, input }) => {
      if (!input.email) {
        return { isUser: false };
      }
      const [exists] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email));
      if (!exists) return { isUser: false };
      return { isUser: true };
    }),
});
