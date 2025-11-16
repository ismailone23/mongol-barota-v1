import { authRoute, competitionRoute, teamRoute } from "./routes";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return { message: "hello world" };
  }),
  auth: authRoute,
  competition: competitionRoute,
  team: teamRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
