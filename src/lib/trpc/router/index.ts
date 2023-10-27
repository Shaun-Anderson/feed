import { t } from "../trpc";
import { feedRouter } from "./feed";

export const appRouter = t.router({
  feed: feedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
