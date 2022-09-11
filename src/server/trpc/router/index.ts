// src/server/trpc/router/index.ts
import { t } from "../utils";
import { authRouter } from "./auth";
import { collectionRouter } from "./collection";
import { auctionRouter } from "./auction"
import { lotRouter } from "./lot";

export const appRouter = t.router({
  auth: authRouter,
  collection: collectionRouter,
  auction: auctionRouter,
  lot: lotRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
