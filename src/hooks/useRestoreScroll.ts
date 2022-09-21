import { useCallback, useEffect, useRef, useState } from "react";
import create from "zustand";

interface ScrollPosition {
  data: { scrollPosition: number };
  setScrollPosition: (position: number) => void;
}

const useStore = create<ScrollPosition>((set) => ({
  data: { scrollPosition: 0 },
  setScrollPosition: (position) => set({ data: { scrollPosition: position }}),
}));

export const useRestoreScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  const scrollPosition = useStore(useCallback((state) => state.data.scrollPosition, []));
  const setScrollPosition = useStore(useCallback((state) => {
    return state.setScrollPosition
  }, []));

  const handleScroll = useCallback((e: any) => {
    setScrollPosition(e.currentTarget.scrollTop);
  }, [setScrollPosition]);

  useEffect(() => {
    ref.current?.addEventListener('scroll', handleScroll);
  }, [ref.current]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current?.scrollTo({
        behavior: "smooth",
        top: scrollPosition,
      });
    }

    return () => ref.current?.removeEventListener('scroll', handleScroll);
  }, [ref, handleScroll]);

  return [ref] as const;
};
