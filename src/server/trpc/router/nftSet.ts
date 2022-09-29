import { t } from "../utils";
import { z } from "zod";
import { NFTStorage, Blob } from 'nft.storage';

const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN || '' })

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
        description: z.string().optional(),
        link: z.string().optional(),
        collectionId: z.string().optional(),
        totalSupply: z.number(),
        creator: z.string(),
        file: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {

      if (!input.file) return "No file present";

      let creatorWallet = await ctx.prisma.wallet.findFirst({
        where: {
          virtual: true,
          userId: input.creator,
        }
      })

      if (!creatorWallet) {
        creatorWallet = await ctx.prisma.wallet.create({
          data: {
            virtual: true,
            userId: input.creator
          }
        })
      }

      if (!creatorWallet) return "No wallet located for creator";

      const base64 = Buffer.from(
        input.file.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const blob = new Blob([base64]);
      const imageCid = await client.storeBlob(blob);

      let collectionId;
      if (input.collectionId) {
        collectionId = input.collectionId;
      } else {
        const newCollection = await ctx.prisma.collection.create({
          data: {
            logoImageUrl: `https://nftstorage.link/ipfs/${imageCid}`,
            name: 'Untitled Collection',
            description: 'Welcome to the home of Untitled Collection on Mage. Discover the best items in this collection.',
            userId: input.creator
          }
        });

        collectionId = newCollection.id;
      }

      const nftEditionObjArray = [];
      for (let index = 0; index < input.totalSupply; index++) {
        nftEditionObjArray.push(
          {
            ownerId: creatorWallet.id,
            minted: false,
          }
        );    
      }

      const nftSet = await ctx.prisma.nFTSet.create({
        data: {
          creatorId: input.creator,
          name: input.name,
          description: input.description,
          blockchainId: "Ethereum",
          imageUrl: `https://nftstorage.link/ipfs/${imageCid}`,
          link: input.link,
          collectionId,
          nftEditions: {
            create: nftEditionObjArray
          }
        }
      });

      return nftSet;
    }),
});
