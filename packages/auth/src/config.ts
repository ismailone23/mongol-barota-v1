import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@workspace/db";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";

import { type DefaultSession, type NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const adapter =
  process.env.RUNTIME === "edge"
    ? undefined
    : DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
        authenticatorsTable: authenticators,
      });

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [],
  secret: process.env.AUTH_SECRET,
  adapter,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email));
        if (!existingUser?.emailVerified) {
          return false;
        }
        return true;
      }
      return false;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    verifyRequest: "/auth/login",
    error: "/auth/login",
  },
};
