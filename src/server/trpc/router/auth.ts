import { TRPCError } from "@trpc/server";
import { t, authedProcedure } from "../utils";
import { ethers } from "ethers";

export const authRouter = t.router({
  getSession: t.procedure.query(async ({ ctx }) => {

    console.log('Get session', ctx.session?.user?.id)

    if (ctx.session?.user && ctx.session.user?.id) {
      let userWallet = await ctx.prisma.wallet.findFirst({
        where: {
          userId: ctx.session.user?.id,
          virtual: true
        }
      })

      if (!userWallet) {
        const wallet = ethers.Wallet.createRandom();

        if (!wallet) return new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not create wallet'
        })
  
        if (wallet) {
          userWallet = await ctx.prisma.wallet.create({
            data: {
              privateKey: wallet.privateKey,
              address: wallet.address,
              mnemonic: wallet.mnemonic?.phrase,
              virtual: false,
              userId: ctx.session.user?.id,
            }
          })
        }
      } else if (!userWallet.address || userWallet.address === '') {
        console.log('Update wallet', userWallet.id)

        const wallet = ethers.Wallet.createRandom();

        if (!wallet) return new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not create wallet'
        })
  
        console.log('Wallet', wallet);
        
        if (wallet) {
          userWallet = await ctx.prisma.wallet.update({
            where: {
              id: userWallet.id
            },
            data: {
              privateKey: wallet.privateKey,
              address: wallet.address,
              mnemonic: wallet.mnemonic?.phrase,
              virtual: false,
              userId: ctx.session.user?.id,
            }
          })
        }
      }
    }

    return ctx.session;
  }),
  getSecretMessage: authedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
});
