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
  create: t.procedure
  .input(
    z.object({ 
      name: z.string(),
      description: z.string(),
      userId: z.string()
    })
  )
  .mutation(async ({ input, ctx }) => {
    const nftSet = await ctx.prisma.collection.create({
      data: {
        description: input.description,
        name: input.name,
        userId: input.userId
      }
    });
    return nftSet;
  }),
});
