import {
  authRoute,
  competitionRoute,
  contactRoute,
  contentRoute,
  galleryRoute,
  joinRoute,
  mediaRoute,
  newsRoute,
  researchRoute,
  teamRoute,
} from "./routes";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return { message: "hello world" };
  }),
  auth: authRoute,
  competition: competitionRoute,
  team: teamRoute,
  contact: contactRoute,
  content: contentRoute,
  gallery: galleryRoute,
  join: joinRoute,
  media: mediaRoute,
  news: newsRoute,
  research: researchRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
