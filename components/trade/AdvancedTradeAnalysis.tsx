"use client";

import { Activity, ChevronDown, GitFork, Headphones, ImageIcon, Layers, Rocket } from "lucide-react";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import {
  LazyComtradeHs6,
  LazyComtradeMirror,
  LazyComtradeTrendSparklines,
  LazyHs2ChapterTreemap,
  LazyTrademapProducts,
  LazyServicesEbops,
  LazyTrademapExhibits,
} from "@/components/trade/LazyCharts";
import { cn } from "@/lib/utils";

export function AdvancedTradeAnalysis({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <div>
          <div className="text-[13.5px] font-semibold text-[var(--color-ink)]">Advanced Trade Analysis</div>
          <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
            HS-6, mirror discrepancies, HS-2 treemap, ITC products, services, and export-potential exhibits
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
          {open ? "Close" : "Open"}
          <ChevronDown className={cn("size-3 transition", open && "rotate-180")} aria-hidden />
        </span>
      </button>

      {open ? (
        <div className="flex flex-col gap-6 border-t border-[var(--color-border)] p-4">
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            <span className="font-semibold text-[var(--color-ink)]">What this section preserves: </span>
            granular product analysis, reporter-side discrepancies, Trade Map prioritization views, and services data.
            These are essential for analysts but too technical for the first trade screen.
          </div>

          <Card tone="people">
            <CardHeader
              icon={<Layers className="size-3.5" />}
              tone="people"
              title="HS-6 commodity structure · UN Comtrade"
              sub="Top-25 product codes for UZ↔US bilateral trade — granular detail beyond StatCom HS-2"
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyComtradeHs6 />
            </CardBody>
          </Card>

          <Card tone="rose">
            <CardHeader
              icon={<GitFork className="size-3.5" />}
              tone="rose"
              title="Mirror discrepancy · UZ-reporter vs US-reporter"
              sub="2024 · same flow seen from both sides at HS-6 level — top-20 by absolute gap"
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyComtradeMirror />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Activity className="size-3.5" />}
              tone="invest"
              title="HS-6 5-year sparklines · Comtrade"
              sub={
                locale === "ru"
                  ? "Динамика топ-10 кодов 2021–2025 + CAGR — выявляет выскакивающие позиции"
                  : locale === "uz-latn"
                    ? "Top-10 kodlarning 2021–2025 dinamikasi + CAGR — o'sib chiqayotganlarni aniqlaydi"
                    : "Top-10 HS-6 codes 2021–2025 with CAGR — surfaces breakout positions"
              }
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyComtradeTrendSparklines />
            </CardBody>
          </Card>

          <Card tone="visits">
            <CardHeader
              icon={<Layers className="size-3.5" />}
              tone="visits"
              title={
                locale === "ru"
                  ? "Структура по главам ТНВЭД · HS-2 treemap"
                  : locale === "uz-latn"
                    ? "HS-2 boblari bo'yicha tuzilma · treemap"
                    : "Trade structure by HS-2 chapters · treemap"
              }
              sub={
                locale === "ru"
                  ? "Главы Harmonized System — крупная разбивка торговли по укрупнённым категориям"
                  : locale === "uz-latn"
                    ? "Harmonized System boblari — savdoning yiriklashtirilgan kategoriyalar bo'yicha taqsimoti"
                    : "Harmonized System chapters — coarse trade decomposition by aggregated categories"
              }
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyHs2ChapterTreemap />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Rocket className="size-3.5" />}
              tone="invest"
              title="ITC Trade Map · 2024 deep view with momentum"
              sub="HS-6 with pre-computed Share % and 5-year compound growth — sortable by value, share, or growth"
              right={<SourceBadge sourceId="trademap_itc" />}
            />
            <CardBody>
              <LazyTrademapProducts />
            </CardBody>
          </Card>

          <Card tone="people">
            <CardHeader
              icon={<Headphones className="size-3.5" />}
              tone="people"
              title="Services trade · EBOPS 2010 / BPM6"
              sub="UZ-reported services exports to the U.S. — what Comtrade cannot show"
              right={<SourceBadge sourceId="trademap_itc" />}
            />
            <CardBody>
              <LazyServicesEbops />
            </CardBody>
          </Card>

          <Card tone="agree">
            <CardHeader
              icon={<ImageIcon className="size-3.5" />}
              tone="agree"
              title="ITC analytical exhibits · export potential & diversification"
              sub="Trade Map's EPI and Diversification Indicator outputs — strategic prioritization views"
              right={<SourceBadge sourceId="trademap_itc" />}
            />
            <CardBody>
              <LazyTrademapExhibits />
            </CardBody>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
