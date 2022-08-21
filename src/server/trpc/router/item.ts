import { t } from "../utils";
import { z } from "zod";

export const itemRouter = t.router({
  get: t.procedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query((input) => {
      return prisma?.item.findFirst({
          where: {
            id: input.input?.id || ''
          }
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany({
      include: {
        collection: true
      }
    });
  }),
});
