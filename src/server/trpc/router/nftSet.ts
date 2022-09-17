import { t } from "../utils";
import { z } from "zod";

export const nftSetRouter = t.router({
  get: t.procedure.input(z.object({ id: z.string() })).query((input) => {
    return prisma?.nFTSet.findFirst({
      where: {
        id: input.input?.id,
      },
      include: {
        collection: true,
        properties: true
      },
    });
  }),
  create: t.procedure
    .input(
      z.object({ 
        name: z.string(),
        collectionId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const nftSet = await ctx.prisma.nFTSet.create({
        data: {
          collectionId: input.collectionId,
          name: input.name
        }
      });
      return nftSet;
    }),
});
