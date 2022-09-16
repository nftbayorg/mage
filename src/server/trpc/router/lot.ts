import { t } from "../utils";
import { z } from "zod";

export const lotRouter = t.router({
  get: t.procedure.input(z.object({ id: z.string() })).query((input) => {
    return prisma?.lot.findFirst({
      where: {
        id: input.input?.id,
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
                    name: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }),
  getByAuction: t.procedure
    .input(z.object({ auctionId: z.string().nullish() }).nullish())
    .query((input) => {
      return prisma?.lot.findFirst({
        where: {
          auctionId: input.input?.auctionId || "",
        },
        include: {
          auction: true,
          nftEdition: {
            include: {
              nftSet: {
                select: {
                  collection: {
                    select: {
                      name: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.lot.findMany({
      include: {
        auction: true,
        nftEdition: true,
      },
    });
  }),
  getInfiniteLots: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.lot.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        include: {
          auction: {
            select: {
              end: true
            }
          }
        }
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const lot = await ctx.prisma.lot.update({
        data: {
          views: {
            increment: 1,
          },
        },
        where: { id: input.id },
      });
      console.log("Lot", lot);
      return lot;
    }),
});
