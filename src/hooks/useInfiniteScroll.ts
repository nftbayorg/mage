import { useCallback, useRef } from "react";
;
export const useInfiniteScroll = (isLoading: boolean, hasNextPage: boolean | undefined, load: Function) => {
  const intObserver = useRef<IntersectionObserver | null>();
  const lastItemRef = useCallback((item: HTMLDivElement) => {
    if (isLoading) return

    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(items => {
      if (items[0]?.isIntersecting && hasNextPage) {
        load();
      }  
    })  

    if (item) intObserver.current.observe(item);

  }, [isLoading, hasNextPage, load]);

  return {
    lastItemRef
  }
};
