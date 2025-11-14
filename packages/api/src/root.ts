import { authRoute } from "./routes";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return { message: "hello world" };
  }),
  auth: authRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
