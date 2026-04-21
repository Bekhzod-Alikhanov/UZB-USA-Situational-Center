"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type AiModel = "claude-sonnet-4-6" | "claude-opus-4-7";

interface SettingsState {
  hideDemo: boolean;
  presentationMode: boolean;
  theme: Theme;
  aiEnabled: boolean;
  aiModel: AiModel;

  setHideDemo: (v: boolean) => void;
  setPresentationMode: (v: boolean) => void;
  setTheme: (v: Theme) => void;
  setAiEnabled: (v: boolean) => void;
  setAiModel: (v: AiModel) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      hideDemo: false,
      presentationMode: false,
      theme: "light",
      aiEnabled: false,
      aiModel: "claude-sonnet-4-6",
      setHideDemo: (v) => set({ hideDemo: v }),
      setPresentationMode: (v) => set({ presentationMode: v }),
      setTheme: (v) => {
        set({ theme: v });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", v === "dark");
        }
      },
      setAiEnabled: (v) => set({ aiEnabled: v }),
      setAiModel: (v) => set({ aiModel: v }),
    }),
    { name: "uzus-settings" }
  )
);
