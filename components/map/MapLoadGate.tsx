"use client";

import dynamic from "next/dynamic";
import { Map, Loader2 } from "lucide-react";
import { useState } from "react";

const UsCenteredMapImpl = dynamic(() => import("./UsCenteredMap").then((m) => ({ default: m.UsCenteredMap })), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[520px] items-center justify-center rounded-md bg-[var(--color-surface-2)] text-[12px] text-[var(--color-ink-muted)]">
      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
      Loading interactive map
    </div>
  ),
});

const COPY = {
  en: {
    title: "Interactive map is available on demand",
    body: "The state-level footprint map uses a heavier browser map runtime. Load it when you need geographic exploration; the summary metrics above stay available immediately.",
    button: "Load interactive map",
  },
  ru: {
    title: "Интерактивная карта доступна по запросу",
    body: "Карта по штатам использует более тяжёлый браузерный runtime. Загружайте её, когда нужна географическая детализация; сводные показатели выше доступны сразу.",
    button: "Загрузить интерактивную карту",
  },
  "uz-latn": {
    title: "Interaktiv xarita so'rov bo'yicha yuklanadi",
    body: "Shtatlar kesimidagi xarita og'irroq browser runtime ishlatadi. Geografik tahlil kerak bo'lganda yuklang; yuqoridagi xulosa ko'rsatkichlari darhol ochiladi.",
    button: "Interaktiv xaritani yuklash",
  },
} as const;

export function MapLoadGate({ locale }: { locale: string }) {
  const [loaded, setLoaded] = useState(false);
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;

  if (loaded) return <UsCenteredMapImpl />;

  // Pick palette based on whether we're inside a Strategic Vision dark page.
  // The .strategic-page wrapper exposes --sv-* tokens; if absent, the
  // CSS-var fallbacks resolve to the original light-mode tokens. This means
  // the same component cleanly serves both /map (dark) and other consumers
  // (light).
  return (
    <div
      className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center"
      style={{
        borderColor: "var(--sv-outline, var(--color-border))",
        background: "var(--sv-surface-low, var(--color-surface-2))",
      }}
    >
      <span
        className="inline-flex size-11 items-center justify-center rounded-lg border"
        style={{
          borderColor: "var(--sv-outline, var(--color-border))",
          background: "var(--sv-surface, var(--color-surface))",
          color: "var(--sv-secondary, var(--color-primary))",
        }}
      >
        <Map className="size-5" aria-hidden />
      </span>
      <h2 className="mt-3 text-[15px] font-semibold" style={{ color: "var(--sv-on-surface, var(--color-ink))" }}>
        {copy.title}
      </h2>
      <p
        className="mt-2 max-w-xl text-[12.5px] leading-relaxed"
        style={{ color: "var(--sv-on-surface-variant, var(--color-ink-muted))" }}
      >
        {copy.body}
      </p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold transition-colors"
        style={{
          background: "var(--sv-secondary, var(--color-primary))",
          color: "var(--sv-primary-container, #ffffff)",
        }}
      >
        <Map className="size-3.5" aria-hidden />
        {copy.button}
      </button>
    </div>
  );
}
