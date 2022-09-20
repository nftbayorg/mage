import { t } from "../utils";
import { z } from "zod";
import { NFTStorage, File } from 'nft.storage';
import { Blob } from 'node:buffer';

const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN || '' })

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function convertBase64ToBlob(base64Image: string) {
  const atob = (data: string) => Buffer.from(data, 'base64').toString('ascii');
  const parts = base64Image.split(';base64,');

  if (!parts || !parts[0] || !parts[1]) return undefined;

  const imageType = parts[0]?.split(':')[1];
  const decodedData = atob(parts[1]);
  const uInt8Array = new Uint8Array(decodedData.length);

  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: imageType });
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

      const blobData = convertBase64ToBlob(input.file);

      if (!blobData) return undefined;

      const metadata = await client.store({
        name: input.name,
        description: input.description || input.name,
        image: new File(
          [
            blobData
          ],
          input.name,
          { type: blobData?.type }
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
