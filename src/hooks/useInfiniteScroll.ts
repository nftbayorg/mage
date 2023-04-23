import { useCallback, useRef } from "react";
;
export const useInfiniteScroll = (isLoading: boolean, hasNextPage: boolean | undefined, load: Function) => {
  const intObserver = useRef<IntersectionObserver | null>();
  const lastItemRef = useCallback((item: HTMLDivElement) => {

    if (isLoading) return

    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(items => {
      console.log('items', items, hasNextPage)
      if (items[0]?.isIntersecting) {
        load();
      }  
    })  

    if (item) intObserver.current.observe(item);

  }, [isLoading, hasNextPage, load]);

  return {
    lastItemRef
  }
};
