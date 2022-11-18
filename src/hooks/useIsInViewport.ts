import { useState, useMemo, useEffect } from "react";

export function useIsInViewport(ref) {
  const [isIntersecting, setIsIntersecting] = useState(true);

  const observer = useMemo(() => {
    if (!ref.current) return;

    return new IntersectionObserver(([entry]) => {
      if (entry) return setIsIntersecting(entry.isIntersecting);
    })
  }, [ref.current]);

  useEffect(() => {
    if (!observer) return;

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}
