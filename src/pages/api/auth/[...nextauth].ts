import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials"

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user }) {

      // if (user && user.id) {
      //   let userWallet = await prisma.wallet.findFirst({
      //     where: {
      //       userId: user.id,
      //       virtual: true
      //     }
      //   })
  
      //   if (!userWallet) {
      //     userWallet = await prisma.wallet.create({
      //       data: {
      //         virtual: true,
      //         userId: user.id
      //       }
      //     })
      //   }
  
      //   if (!userWallet) {
      //     return "Could not sign in - no wallet located"
      //   }
      // }

      return true;
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // CredentialsProvider({
    //   name: "Email",
    //   credentials: {
    //     username: { label: "Email", type: "text", placeholder: "jane.doe@example.com" },
    //     password: {  label: "Password", type: "password" }
    //   },
    //   async authorize(credentials, req) {
    //     // Add logic here to look up the user from the credentials supplied
    //     const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
  
    //     if (user) {
    //       // Any object returned will be saved in `user` property of the JWT
    //       return user
    //     } else {
    //       // If you return null then an error will be displayed advising the user to check their details.
    //       return null
  
    //       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
    //     }
    //   }
    // })
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
