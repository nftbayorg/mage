import { t } from "../utils";
import { z } from "zod";
import { uploadBase64ToIpfs } from "../../../utils/image";
import { TRPCError } from '@trpc/server';

export const collectionRouter = t.router({
  get: t.procedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(({ input, ctx }) => {
      return ctx.prisma.collection.findFirst({
        where: {
          id: input?.id || "",
          visible: true
        },
        include: {
          nftSets: true,
        },
      });
    }),
  getFiltered: t.procedure
    .input(z.object({ 
      id: z.string().nullish(),
      filters: z.record(z.array(z.string())).optional(),
      names: z.array(z.string()).optional()
    }).nullish())
    .query(({ input, ctx }) => {
      let andClauses = Array(0);

      const { filters, names } = input || {};

      if (filters) {
        andClauses = Object.keys(filters).reduce((prev, groupKey) => {

          if (!filters[groupKey] || !filters[groupKey]?.length) {
            return [...prev]
          }          

          return [
            ...prev,
            { properties: { some: { OR: filters[groupKey]?.map(id => ({ id }))}}}
          ]
        }, Array());
      }

      if (names) {
        names.forEach((name, idx) => {
          andClauses.push({
            name: {
              contains: name
            }
          })
        });
      }

      return ctx.prisma.collection.findFirst({
        where: {
          id: input?.id || "",
          visible: true,
        },
        include: {
          nftSets: {
            where: {
              AND: andClauses
            }            
          }
        }
      });
    }),
  getInfiniteFilteredCollection: t.procedure
    .input(z.object({ 
      id: z.string().nullish(),
      filters: z.record(z.array(z.string())).optional(),
      names: z.array(z.string()).optional(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      let andClauses = Array(0);

      const { filters, names } = input || {};

      if (filters) {
        andClauses = Object.keys(filters).reduce((prev, groupKey) => {

          if (!filters[groupKey] || !filters[groupKey]?.length) {
            return [...prev]
          }          

          return [
            ...prev,
            { properties: { some: { OR: filters[groupKey]?.map(id => ({ id }))}}}
          ]
        }, Array());
      }

      if (names) {
        names.forEach((name, idx) => {
          andClauses.push({
            name: {
              contains: name
            }
          })
        });
      }

      const items = await ctx.prisma.collection.findFirst({
        where: {
          id: input?.id || "",
          visible: true,
        },
        include: {
          nftSets: {
            take: limit + 1, // get an extra item at the end which we'll use as next cursor
            cursor: cursor ? { id: cursor } : undefined,
            where: {
              AND: andClauses
            }            
          }
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items?.nftSets && items.nftSets.length > limit) {
        const nextItem = items.nftSets.pop();
        console.log('nextCursor', nextItem)
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),


  getByUser: t.procedure
    .input(
      z.object({
        user: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.collection.findMany({
        where: {
          userId: input.user,
          visible: true,
        },
        include: {
          nftSets: true,
        },
        orderBy: {
          name: "asc"
        }
      });
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany({
      where: {
        visible: true
      }
    });
  }),
  create: t.procedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      logoImageFile: z.string(),
      userId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const authenticatedUserId = ctx.session?.user?.id;

    if (!authenticatedUserId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Must be authenticated to create Collection.",
      });
    }

    if (input.logoImageFile) {
      const logoImageCid = await uploadBase64ToIpfs(input.logoImageFile);

      if (!logoImageCid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: 'Logo image could not be uploaded.',
        });
      }

      const collection = await ctx.prisma.collection.create({
        data: {
          description: input.description,
          name: input.name,
          logoImageUrl: logoImageCid,
          userId: authenticatedUserId,
        }
      });

      return collection;
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: 'No logo image supplied.',
      });
    }
  }),
  updateImages: t.procedure
  .input(
    z.object({
      id: z.string(),
      logoImageFile: z.string().optional(),
      bannerImageFile: z.string().optional(),
      featuredImageFile: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {

    const authenticatedUserId = ctx.session?.user?.id;

    const validCollectionCheck = await ctx.prisma.collection.findFirst({
      where: {
        id: input.id,
        userId: authenticatedUserId
      }
    })

    if (!validCollectionCheck) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid collection.",
      });
    }

    const logoImageCid = await uploadBase64ToIpfs(input.logoImageFile);
    const bannerImageCid = await uploadBase64ToIpfs(input.bannerImageFile);
    const featuredImageCid = await uploadBase64ToIpfs(input.featuredImageFile);
    let data;

    if (input.logoImageFile) {
      data = { logoImageUrl: logoImageCid }
    }

    if (input.featuredImageFile) {
      data = {...data, featureImageUrl: featuredImageCid }
    }

    if (input.bannerImageFile) {
      data = {...data, bannerImageUrl: bannerImageCid }
    }

    if (data) {
      const nftSet = await ctx.prisma.collection.update({
        where: {
          id: input.id
        },
        data,
      });
      return nftSet;
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: 'Please supply at least one image.',
      });

    }
  }),
});