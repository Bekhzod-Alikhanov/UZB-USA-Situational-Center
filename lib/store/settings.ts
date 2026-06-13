"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Theme options:
 * - `light`   classic light primary surface (legacy)
 * - `dark`    classic dark mode
 * - `command` Diplomatic Command Surface, the executive dark default
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
      // Command is the default. Existing light/dark users keep their preference.
      theme: "command",
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
      // v5: removed the AI assistant; strip persisted `aiEnabled`/`aiModel`.
      version: 5,
      migrate: (persisted: unknown, version: number) => {
        let v = persisted as Record<string, unknown> | null;
        if (v && typeof v === "object" && "aiModel" in v) {
          const { aiModel: _aiModel, ...rest } = v;
          v = rest as Record<string, unknown>;
        }
        if (v && typeof v === "object" && "aiEnabled" in v) {
          const { aiEnabled: _aiEnabled, ...rest } = v;
          v = rest as Record<string, unknown>;
        }
        // v2 → v3: legacy values are kept; no field rename needed.
        if (v && typeof v === "object" && v.theme === "strategic") {
          v = { ...v, theme: "command" };
        }
        if (version < 3 && v && typeof v === "object" && !("theme" in v)) {
          v = { ...v, theme: "command" };
        }
        return v as unknown as SettingsState;
      },
    },
  ),
);
