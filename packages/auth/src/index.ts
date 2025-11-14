import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./config";
import { LoginSchema } from "@workspace/api/schema";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const nextAuth = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const [isExists] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));
          if (!isExists) {
            throw new Error("Wrong Credentials !");
          }
          const isPasswordMatched = await bcrypt.compare(
            password,
            isExists.password
          );
          if (!isPasswordMatched) {
            throw new Error("Wrong Credentials !");
          }
          return isExists;
        }
        return null;
      },
    }),
  ],
});

export const auth: typeof nextAuth.auth = nextAuth.auth;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const handlers: typeof nextAuth.handlers = nextAuth.handlers;
export const signOut = nextAuth.signOut;
