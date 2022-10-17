import { Collection, NFTEdition, NFTSet, NFTSetProperties, User, Wallet } from "prisma/prisma-client";

export type DetailedNFTSet = NFTSet & {
  nftEditions: (NFTEdition & {
      owner: Wallet & {
          user: User;
      };
  })[];
  collection: Collection | null;
  properties: NFTSetProperties[];
  liked: boolean;
}


export const computeViewLikeCount = <NFTSet extends NftSetViews>(
  nftSet: NFTSet,
  liked: boolean
): NftSetWithViewLikeCount<Omit<NFTSet, "views" | "likes">> => {
  const { views, likes, ...rest } = nftSet;

  return {
    ...rest,
    viewCount: views.length,
    likeCount: likes.length,
    liked,
  };
}
