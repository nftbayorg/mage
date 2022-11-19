import { useState, useRef, useCallback } from "react";

type useIsInViewportProps = {
  defaultState: boolean;
}

export function useIsInViewport({ defaultState }: useIsInViewportProps) {
  const [isInViewport, setIsInViewport] = useState(defaultState);

  const intObserver = useRef<IntersectionObserver | null>();
  const observerRef = useCallback((element: HTMLDivElement) => {
    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(items => {
      items[0]?.isIntersecting ? setIsInViewport(true) : setIsInViewport(false);
    });

    if (element) intObserver.current.observe(element);
  }, []);

  return { 
    observerRef,
    isInViewport
  };
}
