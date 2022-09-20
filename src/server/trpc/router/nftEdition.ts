import { t } from "../utils";
import { z } from "zod";
import { NFTStorage, File } from 'nft.storage'

const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN || '' })

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
        ownerId: z.string(),
        file: z
          .any()
          .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
          )
      })
    )
    .mutation(async ({ input, ctx }) => {
      const metadata = await client.store({
        name: 'Pinpie',
        description: 'Pin is not delicious beef!',
        image: new File(
          [
            input.file
          ],
          input.name,
          { type: `image/${input.file.name.split('.').pop()}` }
        ),
      });


      const nftSet = await ctx.prisma.nFTEdition.create({
        data: {
          nftSetId: input.nftSetId,
          ownerId: input.ownerId,
          minted: false,
        }
      });
 
      return nftSet;
    }),
});
