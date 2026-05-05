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

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center">
      <span className="inline-flex size-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)]">
        <Map className="size-5" aria-hidden />
      </span>
      <h2 className="mt-3 text-[15px] font-semibold text-[var(--color-ink)]">{copy.title}</h2>
      <p className="mt-2 max-w-xl text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">{copy.body}</p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[var(--color-primary-2)]"
      >
        <Map className="size-3.5" aria-hidden />
        {copy.button}
      </button>
    </div>
  );
}
