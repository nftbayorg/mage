import { t } from "../utils";
import { z } from "zod";

export const collectionRouter = t.router({
  get: t.procedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query((input) => {
      return prisma?.collection.findFirst({
          where: {
            id: input.input?.text || ''
          }
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany();
  }),
});
