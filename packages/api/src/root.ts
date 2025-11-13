import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return { message: "hello world" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
