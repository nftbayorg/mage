
type NftSetViews = {
  views: string[];
  likes: string[];
}
  
type NftSetWithViewCount<T> = T & {
  viewCount: number
}
  