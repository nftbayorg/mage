import { t, authedProcedure } from "../utils";

export const authRouter = t.router({
  getSession: t.procedure.query(async ({ ctx }) => {

    if (ctx.session?.user && ctx.session.user?.id) {
      let userWallet = await ctx.prisma.wallet.findFirst({
        where: {
          userId: ctx.session.user?.id,
          virtual: true
        }
      })

      if (!userWallet) {
        userWallet = await ctx.prisma.wallet.create({
          data: {
            virtual: true,
            userId: ctx.session.user?.id
          }
        })
      }
    }

    return ctx.session;
  }),
  getSecretMessage: authedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
});
