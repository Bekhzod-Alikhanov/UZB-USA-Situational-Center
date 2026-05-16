"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Maximize2, Minus, Plus, RotateCcw, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface Exhibit {
  src: string;
  title: { en: string; ru: string };
  blurb: { en: string; ru: string };
  group: "potential" | "diversification";
  side: "uz-to-us" | "us-to-uz";
}

const EXHIBITS: Exhibit[] = [
  {
    src: "/trademap/uzbekistan-s-products-with-potential-to-united-states.webp",
    title: {
      en: "UZ products with export potential to the U.S. — overview",
      ru: "Продукты UZ с экспортным потенциалом в США — обзор",
    },
    blurb: {
      en: "ITC's Export Potential Indicator: products where Uzbekistan has competitive supply capacity that the U.S. market can absorb, plotted by potential value vs current exports.",
      ru: "ITC Export Potential Indicator: товары, где Узбекистан обладает конкурентной мощностью, которую может поглотить рынок США. Ось — потенциальная стоимость vs текущий экспорт.",
    },
    group: "potential",
    side: "uz-to-us",
  },
  {
    src: "/trademap/uzbekistan-s-products-with-potential-to-united-states-1.webp",
    title: {
      en: "UZ export potential to the U.S. — by product detail",
      ru: "Потенциал экспорта UZ → США — детализация по продукту",
    },
    blurb: {
      en: "Per-HS view of untapped export potential. Bubble size = potential, position = current vs target.",
      ru: "Поэлементный (HS) разрез нереализованного потенциала. Размер = потенциал, позиция = текущий vs целевой.",
    },
    group: "potential",
    side: "uz-to-us",
  },
  {
    src: "/trademap/uzbekistan-s-products-with-potential-to-united-states-2.webp",
    title: {
      en: "UZ export potential — third view",
      ru: "Потенциал экспорта UZ — третий вид",
    },
    blurb: {
      en: "Alternative cut of the Export Potential Indicator (different filter or scale applied in Trade Map UI).",
      ru: "Альтернативный срез Export Potential Indicator (другой фильтр или масштаб в Trade Map).",
    },
    group: "potential",
    side: "uz-to-us",
  },
  {
    src: "/trademap/uzbekistan-s-diversification-products-for-export-to-united-states.webp",
    title: {
      en: "UZ diversification candidates for export to the U.S.",
      ru: "Кандидаты для диверсификации экспорта UZ → США",
    },
    blurb: {
      en: "Products that Uzbekistan does not yet export to the U.S. but plausibly could, based on neighbouring countries' competitive baskets and U.S. demand patterns.",
      ru: "Товары, которые UZ ещё не экспортирует в США, но мог бы — на основе корзин соседних стран и спроса в США.",
    },
    group: "diversification",
    side: "uz-to-us",
  },
  {
    src: "/trademap/united-states-s-products-with-potential-to-uzbekistan.webp",
    title: {
      en: "U.S. products with export potential to Uzbekistan — overview",
      ru: "Продукты США с экспортным потенциалом в UZ — обзор",
    },
    blurb: {
      en: "Mirror analysis: where U.S. supply capacity could grow into the Uzbek market.",
      ru: "Зеркальный анализ: где предложение США может расти на рынке Узбекистана.",
    },
    group: "potential",
    side: "us-to-uz",
  },
  {
    src: "/trademap/united-states-s-products-with-potential-to-uzbekistan-1.webp",
    title: {
      en: "U.S. export potential to UZ — by product detail",
      ru: "Потенциал экспорта США → UZ — детализация по продукту",
    },
    blurb: {
      en: "Per-HS view from the U.S. side.",
      ru: "Поэлементный разрез со стороны США.",
    },
    group: "potential",
    side: "us-to-uz",
  },
  {
    src: "/trademap/united-states-s-diversification-products-for-export-to-uzbekistan.webp",
    title: {
      en: "U.S. diversification candidates for export to Uzbekistan",
      ru: "Кандидаты для диверсификации экспорта США → UZ",
    },
    blurb: {
      en: "Categories where U.S. could expand into Uzbekistan based on global supply benchmarks.",
      ru: "Категории, где США могут расширяться в Узбекистане на основе глобальных бенчмарков.",
    },
    group: "diversification",
    side: "us-to-uz",
  },
];

interface Strings {
  intro: string;
  open: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  close: string;
  openOriginal: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    intro:
      "Trade Map's analytical layer goes beyond raw flows. The charts below — exported from the ITC UI — show the Export Potential Indicator (which products have realistic upside) and Product Diversification (which entirely new products could be added to the basket). Click any thumbnail to open full-size with zoom and pan.",
    open: "Open full-screen",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset zoom",
    close: "Close",
    openOriginal: "Open original",
  },
  ru: {
    intro:
      "Аналитический слой Trade Map — больше, чем сырые потоки. Графики ниже из ITC UI показывают Export Potential Indicator (какие продукты имеют рост) и Product Diversification (какие новые продукты можно добавить). Кликните по миниатюре, чтобы открыть в полный размер с зумом.",
    open: "Открыть на весь экран",
    zoomIn: "Увеличить",
    zoomOut: "Уменьшить",
    reset: "Сбросить",
    close: "Закрыть",
    openOriginal: "Открыть оригинал",
  },
  "uz-latn": {
    intro:
      "Trade Map'ning tahliliy qatlami xom oqimlardan ko'proq narsani beradi. Quyidagi grafiklar ITC UI'dan eksport qilingan: Export Potential Indicator va Product Diversification. To'liq ko'rish uchun rasmni bosing.",
    open: "To'liq ekran",
    zoomIn: "Kattalashtirish",
    zoomOut: "Kichraytirish",
    reset: "Qaytarish",
    close: "Yopish",
    openOriginal: "Asl rasm",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

function pickField(field: { en: string; ru: string }, locale: string): string {
  return locale === "ru" ? field.ru : field.en;
}

export function TrademapExhibits() {
  const locale = useLocale();
  const T = pickStr(locale);
  const [open, setOpen] = useState<Exhibit | null>(null);

  return (
    <>
      <p className="text-[11.5px] text-[var(--color-ink-muted)]">{T.intro}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {EXHIBITS.map((e) => (
          <button
            key={e.src}
            type="button"
            onClick={() => setOpen(e)}
            aria-label={`${T.open}: ${pickField(e.title, locale)}`}
            className={cn(
              "group relative flex flex-col gap-2 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-left transition hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-card-elevated)]",
            )}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-[var(--color-surface-2)]">
              <Image
                src={e.src}
                alt={pickField(e.title, locale)}
                fill
                className="object-contain p-1 transition group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="pointer-events-none absolute right-1.5 top-1.5 flex items-center gap-1 rounded bg-[var(--color-ink)]/70 px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                <ZoomIn className="size-3" />
                {T.open}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider",
                  e.group === "potential"
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
                )}
              >
                {e.group}
              </span>
              <span className="rounded-full bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
                {e.side === "uz-to-us" ? "UZ→US" : "US→UZ"}
              </span>
            </div>
            <h4 className="serif line-clamp-2 text-[12.5px] font-medium leading-snug text-[var(--color-ink)]">
              {pickField(e.title, locale)}
            </h4>
          </button>
        ))}
      </div>

      <ExhibitLightbox
        open={open}
        onClose={() => setOpen(null)}
        labels={{
          zoomIn: T.zoomIn,
          zoomOut: T.zoomOut,
          reset: T.reset,
          close: T.close,
          openOriginal: T.openOriginal,
        }}
        locale={locale}
      />
    </>
  );
}

function ExhibitLightbox({
  open,
  onClose,
  labels,
  locale,
}: {
  open: Exhibit | null;
  onClose: () => void;
  labels: { zoomIn: string; zoomOut: string; reset: string; close: string; openOriginal: string };
  locale: string;
}) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset transform whenever a new exhibit is opened. We track the source
  // and reset during render — this is the React-recommended pattern for
  // "derived state that depends on a prop changing", avoiding setState-in-
  // effect cascades.
  const lastSrcRef = useRef<string | undefined>(open?.src);
  if (open?.src !== lastSrcRef.current) {
    lastSrcRef.current = open?.src;
    if (scale !== 1) setScale(1);
    if (tx !== 0) setTx(0);
    if (ty !== 0) setTy(0);
  }

  function clampTranslate(value: number, axis: number, currentScale: number): number {
    const cap = (axis * (currentScale - 1)) / 2;
    if (currentScale <= 1) return 0;
    return Math.max(-cap, Math.min(cap, value));
  }

  function applyZoom(delta: number, focal?: { x: number; y: number }) {
    setScale((prev) => {
      const next = Math.max(1, Math.min(5, prev + delta));
      if (next === prev) return prev;
      if (next === 1) {
        setTx(0);
        setTy(0);
      } else if (focal && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cx = focal.x - rect.left - rect.width / 2;
        const cy = focal.y - rect.top - rect.height / 2;
        const ratio = next / prev;
        setTx((t) => clampTranslate((t - cx) * ratio + cx, rect.width, next));
        setTy((t) => clampTranslate((t - cy) * ratio + cy, rect.height, next));
      }
      return next;
    });
  }

  function reset() {
    setScale(1);
    setTx(0);
    setTy(0);
  }

  return (
    <Dialog.Root open={!!open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--color-ink)]/80 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[96vh] w-[96vw] max-w-7xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl outline-none"
          aria-describedby="exhibit-blurb"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="serif truncate text-[15px] font-semibold text-[var(--color-ink)] sm:text-[16px]">
                {open ? pickField(open.title, locale) : ""}
              </Dialog.Title>
              <Dialog.Description
                id="exhibit-blurb"
                className="mt-1 line-clamp-2 text-[11.5px] text-[var(--color-ink-muted)] sm:line-clamp-none"
              >
                {open ? pickField(open.blurb, locale) : ""}
              </Dialog.Description>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => applyZoom(-0.5)}
                aria-label={labels.zoomOut}
                title={labels.zoomOut}
                disabled={scale <= 1.05}
                className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span className="mono w-12 text-center text-[11px] tabular text-[var(--color-ink-muted)]">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => applyZoom(0.5)}
                aria-label={labels.zoomIn}
                title={labels.zoomIn}
                disabled={scale >= 4.95}
                className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label={labels.reset}
                title={labels.reset}
                className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              >
                <RotateCcw className="size-4" />
              </button>
              <a
                href={open?.src ?? "#"}
                target="_blank"
                rel="noreferrer"
                aria-label={labels.openOriginal}
                title={labels.openOriginal}
                className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              >
                <Maximize2 className="size-4" />
              </a>
              <Dialog.Close
                aria-label={labels.close}
                title={labels.close}
                className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>
          </div>
          <div
            ref={containerRef}
            className="relative flex-1 select-none overflow-hidden bg-[var(--color-surface-2)]"
            style={{ minHeight: 320, cursor: scale > 1 ? "grab" : "zoom-in" }}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey || e.shiftKey) {
                e.preventDefault();
                applyZoom(e.deltaY < 0 ? 0.25 : -0.25, { x: e.clientX, y: e.clientY });
              }
            }}
            onClick={(e) => {
              if (scale === 1) {
                applyZoom(1, { x: e.clientX, y: e.clientY });
              }
            }}
            onPointerDown={(e) => {
              if (scale <= 1) return;
              dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
              setIsDragging(true);
              (e.currentTarget as HTMLDivElement).style.cursor = "grabbing";
              (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!dragRef.current) return;
              const dx = e.clientX - dragRef.current.x;
              const dy = e.clientY - dragRef.current.y;
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setTx(clampTranslate(dragRef.current.tx + dx, rect.width, scale));
                setTy(clampTranslate(dragRef.current.ty + dy, rect.height, scale));
              }
            }}
            onPointerUp={(e) => {
              dragRef.current = null;
              setIsDragging(false);
              (e.currentTarget as HTMLDivElement).style.cursor = scale > 1 ? "grab" : "zoom-in";
            }}
          >
            {open ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform var(--duration-base) var(--ease-out)",
                }}
              >
                <Image
                  src={open.src}
                  alt={pickField(open.title, locale)}
                  width={1600}
                  height={1200}
                  className="h-auto w-auto max-h-[88vh] max-w-full object-contain"
                  sizes="96vw"
                  priority
                  draggable={false}
                />
              </div>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
