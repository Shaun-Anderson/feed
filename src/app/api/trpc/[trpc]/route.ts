import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "~/lib/trpc/context";
import { appRouter } from "~/lib/trpc/router";

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  });
};

export { handler as GET, handler as POST };
