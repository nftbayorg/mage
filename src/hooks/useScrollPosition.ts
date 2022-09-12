import create from "zustand";

interface ScrollPosition {
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
}

export const useScrollPosition = create<ScrollPosition>((set) => ({
  scrollPosition: 0,
  setScrollPosition: (position) => set({ scrollPosition: position }),
}));
