import { Collection, NFTEdition, NFTSet, NFTSetHistory, NFTSetProperties, User, Wallet } from "prisma/prisma-client";

export type CollectionWithNftSets = Collection & {
  nftSets: NFTSet[]
}


export type DetailedNFTSet = NFTSet & {
  nftEditions: (NFTEdition & {
      owner: Wallet & {
          user: User;
      };
  })[];
  collection: CollectionWithNftSets | null;
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

export type MageCollection = {
  collection: CollectionWithNftSets | null;
  collectionProperties: CollectionNftSetProperties | null;
}
