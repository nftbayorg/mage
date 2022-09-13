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
    console.log('Set scroll position', e.currentTarget.scrollTop);
    setScrollPosition(e.currentTarget.scrollTop);
  }, [setScrollPosition]);

  useEffect(() => {
    console.log('Add event listener');
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
