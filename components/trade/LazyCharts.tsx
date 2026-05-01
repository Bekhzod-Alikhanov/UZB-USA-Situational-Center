"use client";
/**
 * Below-the-fold chart wrappers for /trade.
 *
 * Each heavy chart is `next/dynamic({ ssr: false })`-loaded and then mounted
 * via <LazyMount> so the chunk only fetches when the user scrolls within
 * 240 px of the chart. Result: TradePage's initial JS work drops from
 * "hydrate 9 Recharts/Visx instances at once" to "hydrate the 2 above-the-
 * fold ones; lazy-mount the rest as the user scrolls".
 *
 * Per Lighthouse audit (April 2026): TBT 461 ms → expected ~150 ms.
 */
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { LazyMount } from "@/components/util/LazyMount";
import {
  exportStructure2025,
  importStructure2025,
} from "@/data/trade";

const Skeleton = ({ h }: { h: number }) => (
  <div
    className="w-full animate-pulse rounded-md bg-[var(--color-surface-2)]"
    style={{ height: h }}
    aria-busy
  />
);

// --- Dynamic-loaded chart components ----------------------------------------

const MonthlyTradeChartImpl = dynamic(
  () => import("./MonthlyTradeChart").then((m) => ({ default: m.MonthlyTradeChart })),
  { ssr: false, loading: () => <Skeleton h={300} /> },
);

const StructureTreemapImpl = dynamic(
  () => import("./StructureTreemap").then((m) => ({ default: m.StructureTreemap })),
  { ssr: false, loading: () => <Skeleton h={280} /> },
) as ComponentType<{
  items: typeof exportStructure2025;
  height?: number;
}>;

const ComtradeHs6TopImpl = dynamic(
  () => import("./ComtradeHs6").then((m) => ({ default: m.ComtradeHs6Top })),
  { ssr: false, loading: () => <Skeleton h={400} /> },
);

const ComtradeMirrorImpl = dynamic(
  () => import("./ComtradeMirror").then((m) => ({ default: m.ComtradeMirror })),
  { ssr: false, loading: () => <Skeleton h={400} /> },
);

const ComtradeTrendSparklinesImpl = dynamic(
  () => import("./ComtradeTrendSparklines").then((m) => ({ default: m.ComtradeTrendSparklines })),
  { ssr: false, loading: () => <Skeleton h={300} /> },
);

const Hs2ChapterTreemapImpl = dynamic(
  () => import("./Hs2ChapterTreemap").then((m) => ({ default: m.Hs2ChapterTreemap })),
  { ssr: false, loading: () => <Skeleton h={400} /> },
);

const TrademapProductsImpl = dynamic(
  () => import("./TrademapProducts").then((m) => ({ default: m.TrademapProducts })),
  { ssr: false, loading: () => <Skeleton h={380} /> },
);

const ServicesEbopsImpl = dynamic(
  () => import("./ServicesEbops").then((m) => ({ default: m.ServicesEbops })),
  { ssr: false, loading: () => <Skeleton h={300} /> },
);

const TrademapExhibitsImpl = dynamic(
  () => import("./TrademapExhibits").then((m) => ({ default: m.TrademapExhibits })),
  { ssr: false, loading: () => <Skeleton h={300} /> },
);

// --- LazyMount-wrapped exports ----------------------------------------------

export function LazyMonthlyTrade() {
  return (
    <LazyMount minHeight={320}>
      <MonthlyTradeChartImpl />
    </LazyMount>
  );
}

export function LazyExportStructure() {
  return (
    <LazyMount minHeight={300}>
      <StructureTreemapImpl items={exportStructure2025} height={300} />
    </LazyMount>
  );
}

export function LazyImportStructure() {
  return (
    <LazyMount minHeight={300}>
      <StructureTreemapImpl items={importStructure2025} height={300} />
    </LazyMount>
  );
}

export function LazyComtradeHs6() {
  return (
    <LazyMount minHeight={400}>
      <ComtradeHs6TopImpl />
    </LazyMount>
  );
}

export function LazyComtradeMirror() {
  return (
    <LazyMount minHeight={400}>
      <ComtradeMirrorImpl />
    </LazyMount>
  );
}

export function LazyComtradeTrendSparklines() {
  return (
    <LazyMount minHeight={300}>
      <ComtradeTrendSparklinesImpl />
    </LazyMount>
  );
}

export function LazyHs2ChapterTreemap() {
  return (
    <LazyMount minHeight={400}>
      <Hs2ChapterTreemapImpl />
    </LazyMount>
  );
}

export function LazyTrademapProducts() {
  return (
    <LazyMount minHeight={380}>
      <TrademapProductsImpl />
    </LazyMount>
  );
}

export function LazyServicesEbops() {
  return (
    <LazyMount minHeight={300}>
      <ServicesEbopsImpl />
    </LazyMount>
  );
}

export function LazyTrademapExhibits() {
  return (
    <LazyMount minHeight={300}>
      <TrademapExhibitsImpl />
    </LazyMount>
  );
}
