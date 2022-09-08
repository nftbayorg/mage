import { t } from "../utils";
import { z } from "zod";

export const auctionRouter = t.router({
  get: t.procedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query((input) => {
      return prisma?.auction.findFirst({
          where: {
            id: input.input?.id || ''
          },
          include: {
            lots: {
              select: {
                id: true
              }
            }
          }
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.auction.findMany({
      include: {
        lots: true,
        user: true
      }
    });
  }),
});
