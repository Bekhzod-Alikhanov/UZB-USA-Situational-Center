"use client";
import { create } from "zustand";

interface FilterState {
  tradeYear: number;
  tradeView: "table" | "chart" | "treemap";
  investmentSector: string | "all";
  investmentStatus: string | "all";
  investmentRegion: string | "all";
  visitDirection: "all" | "uz-us" | "us-uz";
  commitmentStatus: string | "all";

  setTradeYear: (y: number) => void;
  setTradeView: (v: FilterState["tradeView"]) => void;
  setInvestmentSector: (s: string) => void;
  setInvestmentStatus: (s: string) => void;
  setInvestmentRegion: (r: string) => void;
  setVisitDirection: (d: FilterState["visitDirection"]) => void;
  setCommitmentStatus: (s: string) => void;
  reset: () => void;
}

const initial = {
  tradeYear: 2025,
  tradeView: "chart" as const,
  investmentSector: "all" as const,
  investmentStatus: "all" as const,
  investmentRegion: "all" as const,
  visitDirection: "all" as const,
  commitmentStatus: "all" as const,
};

export const useFilters = create<FilterState>()((set) => ({
  ...initial,
  setTradeYear: (y) => set({ tradeYear: y }),
  setTradeView: (v) => set({ tradeView: v }),
  setInvestmentSector: (s) => set({ investmentSector: s }),
  setInvestmentStatus: (s) => set({ investmentStatus: s }),
  setInvestmentRegion: (r) => set({ investmentRegion: r }),
  setVisitDirection: (d) => set({ visitDirection: d }),
  setCommitmentStatus: (s) => set({ commitmentStatus: s }),
  reset: () => set(initial),
}));
