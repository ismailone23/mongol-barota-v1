import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@workspace/api";

const createContextAdapter = async ({ req }: { req: Request }) => {
  // create a Headers instance from the incoming request headers
  const heads = new Headers(req.headers as HeadersInit);
  heads.set("x-trpc-source", "edge"); // optional
  return createTRPCContext({ headers: heads });
};

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createContextAdapter,
  });

export { handler as GET, handler as POST };
