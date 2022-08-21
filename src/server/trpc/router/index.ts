// src/server/trpc/router/index.ts
import { t } from "../utils";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { collectionRouter } from "./collection";
import { itemRouter } from "./item";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  collection: collectionRouter,
  item: itemRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
