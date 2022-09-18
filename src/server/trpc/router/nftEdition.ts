import { t } from "../utils";
import { z } from "zod";

export const nftEditionRouter = t.router({
  get: t.procedure.input(z.object({ id: z.string() })).query((input) => {
    return prisma?.nFTEdition.findFirst({
      where: {
        id: input.input?.id,
      },
    });
  }),
  create: t.procedure
    .input(
      z.object({ 
        name: z.string(),
        url: z.string(),
        nftSetId: z.string(),
        ownerId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const nftSet = await ctx.prisma.nFTEdition.create({
        data: {
          nftSetId: input.nftSetId,
          ownerId: input.ownerId,
          minted: false,
          name: input.name,
          url: input.url,
          blockchainId: 'Ethereum'
        }
      });
      return nftSet;
    }),
});
