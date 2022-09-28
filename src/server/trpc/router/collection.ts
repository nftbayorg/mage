import { t } from "../utils";
import { z } from "zod";
import { convertBase64 } from "../../../utils/image";
import { NFTStorage, File, Blob } from "nft.storage";

const client = new NFTStorage({
  token: process.env.NFTSTORAGE_API_TOKEN || "",
});

export const collectionRouter = t.router({
  get: t.procedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query((input) => {
      return prisma?.collection.findFirst({
        where: {
          id: input.input?.id || "",
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
    .query(({ input }) => {
      return prisma?.collection.findMany({
        where: {
          userId: input.user,
        },
        include: {
          nftSets: true,
        },
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
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.logoImageUrl) {
        const base64 = Buffer.from(
          input.logoImageUrl.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        // const type = input.logoImageUrl.split(";")[0]?.split("/")[1];

        if (!base64) return "No file present";

        // const metadata = await client.store({
        //   name: input.name,
        //   description: input.description || input.name,
        //   image: new File(
        //     [base64],
        //     `input.name.${type}`,
        //     { type }
        //   ),
        // });

        const blob = new Blob([base64]);
        const imageCid = await client.storeBlob(blob);

        const nftSet = await ctx.prisma.collection.create({
          data: {
            description: input.description,
            name: input.name,
            logoImageUrl: `https://nftstorage.link/ipfs/${imageCid}`,
            userId: input.userId,
          },
        });
        return nftSet;
      }
    }),
});
