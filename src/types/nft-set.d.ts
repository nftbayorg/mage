
type NftSetViews = {
  views: string[];
  likes: string[];
}
  
type NftSetWithViewLikeCount<T> = T & {
  viewCount: number;
  likeCount: number;
  liked: boolean;
}

type collectionProperties = {
  nftSetsInCollection: number;
  propertyCounts: [{
    _count: { 
      name: number;
    },
    type: string;
    name: string;
  }]
}