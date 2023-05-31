import { User, Wallet } from "prisma/prisma-client";
import { prisma } from "../../server/db/client";
import { ethers } from "ethers";

export default async function fetchMageUser(userId: string): Promise<{
  user: User,
  wallet: Wallet
}> {
  let userWallet;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    }
  });

  if (user) {
    userWallet = await prisma.wallet.findFirst({
      where: {
        userId: user.id,
      }
    })
    
    if (!userWallet) {
      const wallet = ethers.Wallet.createRandom();
  
      if (!wallet) return Promise.reject({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not create wallet'
      })
  
      if (wallet) {
        userWallet = await prisma.wallet.create({
          data: {
            privateKey: wallet.privateKey,
            address: wallet.address,
            mnemonic: wallet.mnemonic?.phrase,
            virtual: false,
            userId: user.id,
          }
        })
      }
    } else if (!userWallet.address || userWallet.address === '') {
      const wallet = ethers.Wallet.createRandom();
  
      if (!wallet) return Promise.reject({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not create wallet'
      })
  
      if (wallet) {
        userWallet = await prisma.wallet.update({
          where: {
            id: userWallet.id
          },
          data: {
            privateKey: wallet.privateKey,
            address: wallet.address,
            mnemonic: wallet.mnemonic?.phrase,
            virtual: false,
            userId: user.id,
          }
        })
      }
    }
  }

  if (!user) {
    return Promise.reject(`Failed to locate user profile`);
  }

  return {
    user,
    wallet: userWallet
  };
}
