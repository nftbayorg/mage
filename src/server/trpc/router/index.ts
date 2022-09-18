// src/server/trpc/router/index.ts
import { t } from "../utils";
import { authRouter } from "./auth";
import { collectionRouter } from "./collection";
import { auctionRouter } from "./auction"
import { lotRouter } from "./lot";
import { nftSetRouter } from "./nftSet";
import { nftEditionRouter } from "./nftEdition";

export const appRouter = t.router({
  auth: authRouter,
  auction: auctionRouter,
  collection: collectionRouter,
  lot: lotRouter,
  nftEdition: nftEditionRouter,
  nftSet: nftSetRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
