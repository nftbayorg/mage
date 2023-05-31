import { t, authedProcedure } from "../utils";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { uploadBase64ToIpfs } from "../../../utils/image";

export const userRouter = t.router({
  update: authedProcedure
  .input(
    z.object({
      profileImageFile: z.string().optional(),
      bannerImageFile: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {

    const authenticatedUserId = ctx.session?.user?.id;

    const validUserCheck = await ctx.prisma.user.findFirst({
      where: {
        id: authenticatedUserId
      }
    })

    if (!validUserCheck) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid collection.",
      });
    }

    const bannerImageCid = await uploadBase64ToIpfs(input.bannerImageFile);
    const profileImageCid = await uploadBase64ToIpfs(input.profileImageFile);
    let data;

    if (input.profileImageFile) {
      data = {...data, profileImageUrl: profileImageCid }
    }

    if (input.bannerImageFile) {
      data = {...data, bannerImageUrl: bannerImageCid }
    }

    if (data) {
      const nftSet = await ctx.prisma.user.update({
        where: {
          id: authenticatedUserId
        },
        data,
      });
      return nftSet;
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: 'Please supply at least one image.',
      });

    }
  }),
});
