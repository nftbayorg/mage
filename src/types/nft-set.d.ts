
type NftSetViews = {
  views: string[];
  likes: string[];
}
  
type NftSetWithViewLikeCount<T> = T & {
  viewCount: number;
  likeCount: number;
  liked: boolean;
}
  