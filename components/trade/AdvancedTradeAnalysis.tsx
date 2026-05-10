"use client";

import { Activity, ChevronDown, GitFork, Headphones, ImageIcon, Layers, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
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

export function AdvancedTradeAnalysis() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("trade.advanced");

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <div>
          <div className="text-[13.5px] font-semibold text-[var(--color-ink)]">{t("title")}</div>
          <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">{t("subtitle")}</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
          {open ? t("close") : t("open")}
          <ChevronDown className={cn("size-3 transition", open && "rotate-180")} aria-hidden />
        </span>
      </button>

      {open ? (
        <div className="flex flex-col gap-6 border-t border-[var(--color-border)] p-4">
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            <span className="font-semibold text-[var(--color-ink)]">{t("preservesLabel")} </span>
            {t("preservesText")}
          </div>

          <Card tone="people">
            <CardHeader
              icon={<Layers className="size-3.5" />}
              tone="people"
              title={t("cards.hs6Title")}
              sub={t("cards.hs6Sub")}
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
              title={t("cards.mirrorTitle")}
              sub={t("cards.mirrorSub")}
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
              title={t("cards.sparkTitle")}
              sub={t("cards.sparkSub")}
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
              title={t("cards.treemapTitle")}
              sub={t("cards.treemapSub")}
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
              title={t("cards.itcTitle")}
              sub={t("cards.itcSub")}
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
              title={t("cards.servicesTitle")}
              sub={t("cards.servicesSub")}
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
              title={t("cards.exhibitsTitle")}
              sub={t("cards.exhibitsSub")}
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
