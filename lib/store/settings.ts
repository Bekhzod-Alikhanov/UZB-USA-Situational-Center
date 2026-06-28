"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Global UI store. Light is the default executive reading surface, while
 * dark and command remain available for focused operating-room contexts.
 */
export type Theme = "light" | "dark" | "command";

interface SettingsState {
  hideDemo: boolean;
  presentationMode: boolean;
  theme: Theme;

  setHideDemo: (v: boolean) => void;
  setPresentationMode: (v: boolean) => void;
  setTheme: (v: Theme) => void;
}

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("command", theme === "command");
  html.classList.toggle("strategic", theme === "command");
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      hideDemo: false,
      presentationMode: false,
      theme: "light",
      setHideDemo: (v) => {
        set({ hideDemo: v });
        if (typeof document !== "undefined") {
          document.documentElement.toggleAttribute("data-hide-demo", v);
        }
      },
      setPresentationMode: (v) => {
        set({ presentationMode: v });
        if (typeof document !== "undefined") {
          document.documentElement.toggleAttribute("data-presentation", v);
        }
      },
      setTheme: (v) => {
        set({ theme: v });
        applyThemeClass(v);
      },
    }),
    {
      name: "uzus-settings",
      // v7: restore theme selection with light as the default. Keep legacy
      // strategic users on the command surface.
      version: 7,
      migrate: (persisted: unknown, version: number) => {
        let v = persisted as Record<string, unknown> | null;
        if (v && typeof v === "object" && v.theme === "strategic") {
          v = { ...v, theme: "command" };
        }
        if (version < 7 && v && typeof v === "object" && !("theme" in v)) {
          v = { ...v, theme: "light" };
        }
        return v as unknown as SettingsState;
      },
    },
  ),
);
