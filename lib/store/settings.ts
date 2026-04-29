"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface SettingsState {
  hideDemo: boolean;
  presentationMode: boolean;
  theme: Theme;
  aiEnabled: boolean;

  setHideDemo: (v: boolean) => void;
  setPresentationMode: (v: boolean) => void;
  setTheme: (v: Theme) => void;
  setAiEnabled: (v: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      hideDemo: false,
      presentationMode: false,
      theme: "light",
      aiEnabled: false,
      setHideDemo: (v) => set({ hideDemo: v }),
      setPresentationMode: (v) => set({ presentationMode: v }),
      setTheme: (v) => {
        set({ theme: v });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", v === "dark");
        }
      },
      setAiEnabled: (v) => set({ aiEnabled: v }),
    }),
    {
      name: "uzus-settings",
      // v2: dropped `aiModel` field. Strip it from any stale persisted state
      // so users with older localStorage entries don't keep ghost data around.
      version: 2,
      migrate: (persisted: unknown) => {
        if (persisted && typeof persisted === "object" && "aiModel" in persisted) {
          const { aiModel: _aiModel, ...rest } = persisted as Record<string, unknown>;
          return rest as unknown as SettingsState;
        }
        return persisted as SettingsState;
      },
    },
  ),
);
