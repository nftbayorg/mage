import { useState, useMemo, useEffect } from "react";

export function useIsInViewport(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(() => {
    if (!ref.current) return;

    return new IntersectionObserver(([entry]) => {
      if (entry) return setIsIntersecting(entry.isIntersecting);
    })
  }, []);

  useEffect(() => {
    if (!observer) return;
    
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}
