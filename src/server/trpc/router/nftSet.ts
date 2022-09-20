import { t } from "../utils";
import { z } from "zod";
import { NFTStorage, File } from 'nft.storage';
import { Blob } from 'buffer';

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
        collectionId: z.string(),
        totalSupply: z.number(),
        ownerId: z.string(),
        file: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {

      const fileData = convertBase64(input.file);

      if (!fileData) return undefined;

      const metadata = await client.store({
        name: input.name,
        description: input.description || input.name,
        image: new File(
          [fileData.data],
          input.name,
          { type: fileData?.type }
        ),
      });

      const nftSet = await ctx.prisma.nFTSet.create({
        data: {
          collectionId: input.collectionId,
          name: input.name,
          description: input.description,
          blockchainId: "Ethereum",
          imageUrl: metadata.url,
          link: input.link,
        }
      });

      let promises = [];
      for (let index = 0; index < input.totalSupply; index++) {
        promises.push(ctx.prisma.nFTEdition.create({
          data: {
            nftSetId: nftSet.id,
            ownerId: input.ownerId,
            minted: false,
          }
        }));    
      }

      await Promise.allSettled(promises);

      return nftSet;
    }),
});
