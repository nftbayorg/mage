
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

type NftSetDetailCollectionProperties = {
  nftSetsInCollection: number;
  propertyCounts: NftSetPropertyTypes;
}