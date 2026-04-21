"use client";
import { create } from "zustand";

interface SearchState {
  open: boolean;
  query: string;
  setOpen: (v: boolean) => void;
  setQuery: (q: string) => void;
  toggle: () => void;
}

export const useSearch = create<SearchState>()((set) => ({
  open: false,
  query: "",
  setOpen: (v) => set({ open: v }),
  setQuery: (q) => set({ query: q }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
