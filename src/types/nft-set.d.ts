
type NftSetViews = {
  views: string[];
}
  
type NftSetWithViewCount<T> = T & {
  viewCount: number
}
  