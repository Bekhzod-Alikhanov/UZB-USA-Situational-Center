"use client";
import { useTranslations } from "next-intl";
import * as Tabs from "@radix-ui/react-tabs";
import { VisitsTimeline } from "./VisitsTimeline";
import { visits } from "@/data/visits";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export function VisitsTabs() {
  const t = useTranslations("visits.tabs");
  const [direction, setDirection] = useState<"all" | "uz-us" | "us-uz">("all");

  const filtered = useMemo(() => {
    return direction === "all" ? visits : visits.filter((v) => v.direction === direction);
  }, [direction]);

  return (
    <Tabs.Root defaultValue="timeline" className="flex flex-col">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-0">
        <Tabs.List className="flex gap-0">
          {[
            { v: "timeline", l: t("timeline") },
            { v: "grid", l: t("grid") },
            { v: "table", l: t("table") },
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.v}
              value={tab.v}
              className="relative border-b-2 border-transparent px-4 py-2.5 text-[13px] font-medium text-[var(--color-ink-muted)] outline-none transition data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]"
            >
              {tab.l}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex items-center gap-2 pb-2 pr-2 text-[11px]">
          {(
            [
              { v: "all", l: "All" },
              { v: "uz-us", l: "UZ → US" },
              { v: "us-uz", l: "US → UZ" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setDirection(opt.v)}
              className={cn(
                "rounded-md border px-2 py-1 transition",
                direction === opt.v
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      <Tabs.Content value="timeline" className="mt-5">
        <VisitsTimeline filterDirection={direction} />
      </Tabs.Content>

      <Tabs.Content value="grid" className="mt-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 30).map((v) => (
            <div key={v.id} className="card p-4 transition hover:shadow-[var(--shadow-hover)]">
              <div className="mono text-[11px] text-[var(--color-ink-muted)]">{v.date}</div>
              <div className="mt-1 text-[14px] font-medium text-[var(--color-ink)]">{v.title}</div>
              <div className="mt-1 text-[11.5px] text-[var(--color-ink-muted)]">{v.location}</div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 uppercase tracking-wider text-[var(--color-ink-muted)]">
                  {v.level}
                </span>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 uppercase tracking-wider text-[var(--color-ink-muted)]">
                  {v.format}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Tabs.Content>

      <Tabs.Content value="table" className="mt-5">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-[90px]">Date</th>
                <th>Title</th>
                <th className="w-[92px]">Level</th>
                <th className="w-[96px]">Direction</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td className="mono text-[11.5px]">{v.date}</td>
                  <td className="font-medium">{v.title}</td>
                  <td className="uppercase tracking-wider text-[11px] text-[var(--color-ink-muted)]">{v.level}</td>
                  <td className="text-[11.5px] text-[var(--color-ink-muted)]">{v.direction}</td>
                  <td className="text-[11.5px] text-[var(--color-ink-muted)]">{v.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
