import { Collection, NFTEdition, NFTSet, NFTSetHistory, NFTSetProperties, User, Wallet } from "prisma/prisma-client";

export type DetailedNFTSet = NFTSet & {
  nftEditions: (NFTEdition & {
      owner: Wallet & {
          user: User;
      };
  })[];
  collection: Collection | null;
  properties: NFTSetProperties[];
  history: NFTSetHistory[];
  liked: boolean;
}

export type NFTSetWithMeta = DetailedNFTSet & NftSetWithViewLikeCount<Omit<NFTSet, "views" | "likes">>;

export const computeViewLikeCount = (
  nftSet: DetailedNFTSet,
  liked: boolean
): NFTSetWithMeta => {
  const { views, likes, ...rest } = nftSet;

  return {
    ...rest,
    viewCount: views.length,
    likeCount: likes.length,
    views,
    likes,
    liked,
  };
}
