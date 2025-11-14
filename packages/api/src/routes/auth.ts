import { RegisterSchema } from "../schema/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { users } from "@workspace/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
});
