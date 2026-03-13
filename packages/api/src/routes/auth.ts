import {
  ForgotPasswordSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "@workspace/types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { users, verificationTokens } from "@workspace/db/schema";
import { and, asc, eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../lib/mail";
import * as z from "zod";

export const authRoute = createTRPCRouter({
  registerUser: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const [isExists] = await ctx.db
        .select()
        .from(users)
        .where(
          or(eq(users.email, input.email), eq(users.mistId, input.mistid)),
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
        if (!currentUser?.emailVerified) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only verified users can perform this action",
          });
        }
        if (currentUser.id === input.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can't delete your own account",
          });
        }
        const [deletedUser] = await ctx.db
          .delete(users)
          .where(eq(users.id, input.id))
          .returning();
        if (deletedUser) {
          return { deleteUser: deletedUser, message: "User deleted" };
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }),
  allUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mistId: users.mistId,
        emailVerified: users.emailVerified,
        image: users.image,
      })
      .from(users)
      .orderBy(asc(users.emailVerified));
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
  forgotPassword: publicProcedure
    .input(ForgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email));
      if (!user) {
        // Return success even if user not found to prevent email enumeration
        return { message: "If that email exists, a reset link has been sent." };
      }

      // Delete any existing tokens for this email
      await ctx.db
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, input.email));

      // Generate a secure token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await ctx.db.insert(verificationTokens).values({
        identifier: input.email,
        token,
        expires,
      });

      const resetUrl = `${process.env.PANEL_URL ?? "http://localhost:3001"}/auth/forgot-password?token=${token}&email=${encodeURIComponent(input.email)}`;

      await sendMail({
        to: input.email,
        subject: "Mongol Barota – Password Reset",
        text: `You requested a password reset.\n\nClick the link below to reset your password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
      });

      return { message: "If that email exists, a reset link has been sent." };
    }),
  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const [record] = await ctx.db
        .select()
        .from(verificationTokens)
        .where(and(eq(verificationTokens.token, input.token)));
      if (!record || record.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired reset token",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, record.identifier));

      // Delete the used token
      await ctx.db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, record.identifier),
            eq(verificationTokens.token, input.token),
          ),
        );

      return { message: "Password has been reset successfully" };
    }),
});
