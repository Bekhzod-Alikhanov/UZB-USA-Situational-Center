"use client";

import dynamic from "next/dynamic";
import { Building2, GraduationCap, Layers3, Loader2, Map, Plane } from "lucide-react";
import { useState } from "react";

const UsCenteredMapImpl = dynamic(() => import("./UsCenteredMap").then((m) => ({ default: m.UsCenteredMap })), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[520px] items-center justify-center rounded-md bg-[var(--color-surface-2)] text-[12px] text-[var(--color-ink-muted)]"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-4 animate-spin" aria-hidden />
      <span className="sr-only">Loading</span>
    </div>
  ),
});

const COPY = {
  en: {
    title: "Interactive map is available on demand",
    body: "The state-level footprint map uses a heavier browser map runtime. Load it when you need geographic exploration; the summary metrics above stay available immediately.",
    previewTitle: "What loads",
    layers: ["State GDP and population", "UZ missions and planned visits", "Students and engagement signals"],
    use: "Use it to choose which state deserves the next visit, mission opening, or trade-promotion event.",
    button: "Load interactive map",
  },
  ru: {
    title: "Интерактивная карта доступна по запросу",
    body: "Карта по штатам использует более тяжелый браузерный модуль. Загружайте ее, когда нужна географическая детализация; сводные показатели выше доступны сразу.",
    previewTitle: "Что загрузится",
    layers: ["ВВП и население штатов", "Миссии УЗ и плановые визиты", "Студенты и сигналы вовлечения"],
    use: "Используйте карту, чтобы выбрать штат для следующего визита, открытия миссии или торгового мероприятия.",
    button: "Загрузить интерактивную карту",
  },
  "uz-latn": {
    title: "Interaktiv xarita so'rov bo'yicha yuklanadi",
    body: "Shtatlar kesimidagi xarita og'irroq browser modulidan foydalanadi. Geografik tahlil kerak bo'lganda yuklang; yuqoridagi xulosa ko'rsatkichlari darhol ochiladi.",
    previewTitle: "Nima yuklanadi",
    layers: ["Shtat YaIMi va aholisi", "UZ missiyalari va rejalangan tashriflar", "Talabalar va faollik signallari"],
    use: "Keyingi tashrif, missiya ochilishi yoki savdo tadbiri uchun qaysi shtat muhimligini tanlashda foydalaning.",
    button: "Interaktiv xaritani yuklash",
  },
} as const;

export function MapLoadGate({ locale }: { locale: string }) {
  const [loaded, setLoaded] = useState(false);
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;

  if (loaded) return <UsCenteredMapImpl />;

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

      <div
        className="mt-4 w-full max-w-xl rounded-xl border p-3 text-left"
        style={{
          borderColor: "var(--sv-outline, var(--color-border))",
          background: "color-mix(in oklab, var(--sv-surface, var(--color-surface)) 82%, transparent)",
        }}
      >
        <div
          className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--sv-secondary, var(--color-primary))" }}
        >
          {copy.previewTitle}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {copy.layers.map((label, index) => {
            const icons = [Building2, Plane, GraduationCap] as const;
            const Icon = icons[index] ?? Layers3;
            return (
              <div
                key={label}
                className="flex items-start gap-2 rounded-lg border border-[var(--sv-outline,var(--color-border))] p-2"
              >
                <Icon
                  className="mt-0.5 size-3.5 shrink-0"
                  style={{ color: "var(--sv-secondary, var(--color-primary))" }}
                />
                <span className="text-[11px] leading-snug" style={{ color: "var(--sv-on-surface, var(--color-ink))" }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <p
          className="mt-2 text-[11.5px] leading-relaxed"
          style={{ color: "var(--sv-on-surface-variant, var(--color-ink-muted))" }}
        >
          {copy.use}
        </p>
      </div>

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
