import { t } from "../utils";
import { z } from "zod";
import { NFTStorage, File } from 'nft.storage';

const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN || '' })

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function convertBase64(base64Image: string) {
  const atob = (data: string) => Buffer.from(data, 'base64').toString('ascii');
  const parts = base64Image.split(';base64,');

  if (!parts || !parts[0] || !parts[1]) return undefined;

  const imageType = parts[0]?.split(':')[1];
  const decodedData = atob(parts[1]);
  const uInt8Array = new Uint8Array(decodedData.length);

  return { data: uInt8Array.buffer , type: imageType };
}

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

      const fileData = convertBase64(input.file);

      if (!fileData) return "No file present";

      const creatorWallet = await ctx.prisma.wallet.findFirst({
        where: {
          virtual: true,
          userId: input.creator,
        }
      })

      if (!creatorWallet) return "No wallet located for creator";

      const metadata = await client.store({
        name: input.name,
        description: input.description || input.name,
        image: new File(
          [fileData.data],
          input.name,
          { type: fileData?.type }
        ),
      });

      let collectionId;
      if (input.collectionId) {
        collectionId = input.collectionId;
      } else {
        const newCollection = await ctx.prisma.collection.create({
          data: {
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
          imageUrl: metadata.url,
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
