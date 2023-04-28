import { createTRPCRouter } from "~/server/api/trpc";
import { breadthRouter } from "~/server/api/routers/breadth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  breadth: breadthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
