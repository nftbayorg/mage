import { t } from "../utils";
import { z } from "zod";
import { convertBase64 } from "../../../utils/file";
import { NFTStorage, File } from "nft.storage";

const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN || '' })

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
  getByUser: t.procedure
    .input(z.object({ 
      user: z.string() 
    }))
    .query(({ input }) => {
      return prisma?.collection.findMany({
        where: {
          userId: input.user
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
      logoImageUrl: z.string(),
      userId: z.string()
    })
  )
  .mutation(async ({ input, ctx }) => {

    const fileData = convertBase64(input.logoImageUrl);

    if (!fileData) return "No file present";

    const metadata = await client.store({
      name: input.name,
      description: input.description || input.name,
      image: new File(
        [fileData.data],
        input.name,
        { type: fileData?.type }
      ),
    });

    const nftSet = await ctx.prisma.collection.create({
      data: {
        description: input.description,
        name: input.name,
        logoImageUrl: metadata.url,
        userId: input.userId
      }
    });
    return nftSet;
  }),
});
