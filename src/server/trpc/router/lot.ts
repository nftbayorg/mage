import { t } from "../utils";
import { z } from "zod";

export const lotRouter = t.router({
  get: t.procedure
    .input(z.object({ id: z.string() }))
    .query((input) => {
      return prisma?.lot.findFirst({
          where: {
            id: input.input?.id
          },
          include: {
            auction: true,
            nftEdition: {
              include: {
                owner: true,
                nftSet: {
                  select: {
                    collection: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
      });
    }),
  getByAuction: t.procedure
    .input(z.object({ auctionId: z.string().nullish() }).nullish())
    .query((input) => {
      return prisma?.lot.findFirst({
          where: {
            auctionId: input.input?.auctionId || ''
          },
          include: {
            auction: true,
            nftEdition: {
              include: {
                nftSet: {
                  select: {
                    collection: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.lot.findMany({
      include: {
        auction: true,
        nftEdition: true
      }
    });
  }),
});
