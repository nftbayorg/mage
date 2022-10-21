
type NftSetViews = {
  views: string[];
  likes: string[];
}
  
type NftSetWithViewLikeCount<T> = T & {
  viewCount: number;
  likeCount: number;
  liked: boolean;
}

type CollectionNftSetProperty = {
  [type: string]: [{
    _count: number;
    type: string;
    name: string;
  }]
}

type CollectionNftSetProperties = {
  nftSetsInCollection: number;
  propertyCounts: CollectionNftSetProperty;
}