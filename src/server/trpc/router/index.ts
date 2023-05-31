// src/server/trpc/router/index.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { collectionRouter } from "./collection";
import { auctionRouter } from "./auction";
import { lotRouter } from "./lot";
import { nftSetRouter } from "./nftSet";
import { nftEditionRouter } from "./nftEdition";
import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from "../context";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  auction: auctionRouter,
  collection: collectionRouter,
  lot: lotRouter,
  nftEdition: nftEditionRouter,
  nftSet: nftSetRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  responseMeta({ ctx, paths, type, errors }) {
    // assuming you have all your public routes with the keyword `public` in them
    const allPublic = paths && paths.every((path) => path.includes('public'));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === 'query';
    if (ctx?.res && allPublic && allOk && isQuery) {
      // cache request for 1 day + revalidate once every second
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      return {
        headers: {
          'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});