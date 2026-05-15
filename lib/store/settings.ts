"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Theme options:
 * - `light`     classic light primary surface (legacy)
 * - `dark`      classic dark mode
 * - `strategic` Strategic Vision 2026 — dark glassmorphic, navy + cyan accents
 *               (May 2026 redesign, default for new sessions)
 */
export type Theme = "light" | "dark" | "strategic";

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

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("strategic", theme === "strategic");
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      hideDemo: false,
      presentationMode: false,
      // Strategic Vision is the new default. Existing users with persisted
      // "light"/"dark" values keep their preference (migrate untouched).
      theme: "strategic",
      aiEnabled: false,
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
      setAiEnabled: (v) => set({ aiEnabled: v }),
    }),
    {
      name: "uzus-settings",
      // v3: introduced theme = "strategic" as the default. Old v2 entries
      // with `theme: "light"` or `"dark"` keep their preference.
      version: 3,
      migrate: (persisted: unknown, version: number) => {
        let v = persisted as Record<string, unknown> | null;
        if (v && typeof v === "object" && "aiModel" in v) {
          const { aiModel: _aiModel, ...rest } = v;
          v = rest as Record<string, unknown>;
        }
        // v2 → v3: legacy values are kept; no field rename needed.
        if (version < 3 && v && typeof v === "object" && !("theme" in v)) {
          v = { ...v, theme: "strategic" };
        }
        return v as unknown as SettingsState;
      },
    },
  ),
);
