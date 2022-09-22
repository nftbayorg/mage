import { t } from "../utils";
import { z } from "zod";

export const auctionRouter = t.router({
  get: t.procedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query((input) => {
      return prisma?.auction.findFirst({
        where: {
          id: input.input?.id || "",
        },
        include: {
          lots: {
            select: {
              id: true,
            },
          },
        },
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.auction.findMany({
      include: {
        lots: true,
        user: true,
      },
    });
  }),
  getInfiniteAuctions: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.auction.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        include: {
          lots: {
            select: {
              id: true,
              reservePrice: true,
              auction: {
                select: {
                  end: true
                }
              },
              nftEdition: {
                select: {
                  nftSet: {
                    select: {
                      imageUrl: true,
                      name: true,
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
          }
        },
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
});
