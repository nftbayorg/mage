// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/trpc/router";
import { createContext } from "../../../server/trpc/context";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    }
  }
}

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  maxBodySize: 1000000
});
