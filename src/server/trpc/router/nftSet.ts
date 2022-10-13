import { t } from "../utils";
import { z } from "zod";
import { NFTStorage, Blob } from 'nft.storage';
import { TRPCError } from "@trpc/server";

const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN || '' })

export const nftSetRouter = t.router({
  getLean: t.procedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma?.nFTSet.findFirst({
      where: {
        id: input?.id,
      },
    });
  }),
  get: t.procedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma?.nFTSet.findFirst({
      where: {
        id: input?.id,
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
        file: z.string(),
        properties: z.array(z.object({
          type: z.string(),
          name: z.string()
        })).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const authenticatedUserId = ctx.session?.user?.id;

      if (!authenticatedUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must authenticated to create NFT.",
        });
      }
      if (!input.file) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No file present.",
        });
      }

      let creatorWallet = await ctx.prisma.wallet.findFirst({
        where: {
          virtual: true,
          userId: authenticatedUserId,
        }
      })

      if (!creatorWallet) {
        creatorWallet = await ctx.prisma.wallet.create({
          data: {
            virtual: true,
            userId: authenticatedUserId
          }
        })
      }

      if (!creatorWallet) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No wallet located for creator.",
        });
      } 

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

        const count = await ctx.prisma.collection.count() || 0;

        const newCollection = await ctx.prisma.collection.create({
          data: {
            logoImageUrl: `https://nftstorage.link/ipfs/${imageCid}`,
            name: `Untitled Collection #${count +1}`,
            description: 'Welcome to the home of Untitled Collection on Mage. Discover the best items in this collection.',
            userId: authenticatedUserId
          }
        });

        collectionId = newCollection.id;
      }

      const validCollectionCheck = await ctx.prisma.collection.findFirst({
        where: {
          id: collectionId,
          userId: authenticatedUserId
        }
      })

      if (!validCollectionCheck) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid collection.",
        });
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
          creatorId: authenticatedUserId,
          name: input.name,
          description: input.description,
          blockchainId: "Ethereum",
          imageUrl: `https://nftstorage.link/ipfs/${imageCid}`,
          link: input.link,
          collectionId,
          nftEditions: {
            create: nftEditionObjArray
          },
          properties: {
            create: input.properties
          }
        }
      });

      return nftSet;
    }),
});
