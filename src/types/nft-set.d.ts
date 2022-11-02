
type NftSetViews = {
  views: string[];
  likes: string[];
}
  
type NftSetWithViewLikeCount<T> = T & {
  viewCount: number;
  likeCount: number;
  liked: boolean;
}

type NftSetPropertyTypes = {
  [type: string]: [{
    _count: number;
    id: string;
    type: string;
    name: string;
  }]
}

type CollectionNftSetProperty = {
  [type: string]: {
    _count: number;
    variants: {
      [name: string]: string[];
    }
  }
}

type CollectionNftSetProperties = {
  nftSetsInCollection: number;
  propertyCounts: CollectionNftSetProperty;
}

type NftSetDetailCollectionProperties = {
  nftSetsInCollection: number;
  propertyCounts: NftSetPropertyTypes;
}