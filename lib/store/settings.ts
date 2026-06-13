"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Global UI store. The dashboard ships a single visual theme — the
 * Diplomatic Command Surface, applied via the `command` class on `<html>`
 * in `app/layout.tsx`. The legacy light/dark/strategic theme options were
 * removed in the design-system reset; the light palette survives only inside
 * the `@media print` block in `globals.css` so PDFs stay clean.
 */
interface SettingsState {
  hideDemo: boolean;
  presentationMode: boolean;

  setHideDemo: (v: boolean) => void;
  setPresentationMode: (v: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      hideDemo: false,
      presentationMode: false,
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
    }),
    {
      name: "uzus-settings",
      // v6: design-system reset — single `command` theme. Strip any persisted
      // `theme`/`aiModel`/`aiEnabled` from earlier versions.
      version: 6,
      migrate: (persisted: unknown) => {
        let v = persisted as Record<string, unknown> | null;
        for (const stale of ["aiModel", "aiEnabled", "theme"]) {
          if (v && typeof v === "object" && stale in v) {
            const { [stale]: _drop, ...rest } = v;
            v = rest as Record<string, unknown>;
          }
        }
        return v as unknown as SettingsState;
      },
    },
  ),
);
