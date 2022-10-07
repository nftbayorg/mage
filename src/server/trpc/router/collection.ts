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

    if (input.logoImageFile) {
      const logoImageCid = await uploadBase64ToIpfs(input.logoImageFile);

      if (!logoImageCid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: 'Logo image could not be uploaded.',
        });
      }

      const nftSet = await ctx.prisma.collection.create({
        data: {
          description: input.description,
          name: input.name,
          logoImageUrl: logoImageCid,
          userId: input.userId,
        }
      });

      return nftSet;
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