"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, Minus } from "lucide-react";
import { benchmark, type RegionalMetric } from "@/data/benchmark";
import { cn } from "@/lib/utils";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { LazyMount } from "@/components/util/LazyMount";

// Recharts BarChart is dynamic-loaded + IntersectionObserver-gated. The
// Benchmark route's KPIs and metric switcher render immediately; the chart
// chunk only fetches when the user scrolls toward it.
const BenchmarkChart = dynamic(() => import("./BenchmarkChart").then((m) => ({ default: m.BenchmarkChart })), {
  ssr: false,
  loading: () => <div className="h-[260px] w-full animate-pulse rounded-md bg-[var(--color-surface-2)] sm:h-[280px]" />,
});

type MetricKey =
  | "gdpUsdBn"
  | "populationM"
  | "tradeWithUsUsdBn"
  | "exportsToUsUsdM"
  | "importsFromUsUsdM"
  | "fdiFromUsUsdM";

interface MetricDef {
  key: MetricKey;
  label: string;
  unit: string;
  format: (n: number) => string;
}

const METRICS: MetricDef[] = [
  { key: "tradeWithUsUsdBn", label: "Trade with US", unit: "$Bn", format: (n) => `$${n.toFixed(2)}B` },
  { key: "exportsToUsUsdM", label: "Exports to US", unit: "$M", format: (n) => `$${n.toLocaleString()}M` },
  { key: "importsFromUsUsdM", label: "Imports from US", unit: "$M", format: (n) => `$${n.toLocaleString()}M` },
  { key: "fdiFromUsUsdM", label: "Cumulative US FDI", unit: "$M", format: (n) => `$${n.toLocaleString()}M` },
  { key: "gdpUsdBn", label: "GDP", unit: "$Bn", format: (n) => `$${n.toFixed(1)}B` },
  { key: "populationM", label: "Population", unit: "M", format: (n) => `${n.toFixed(1)}M` },
];

const COUNTRY_NAME: Record<RegionalMetric["country"], string> = {
  UZ: "Uzbekistan",
  KZ: "Kazakhstan",
  KG: "Kyrgyzstan",
  TJ: "Tajikistan",
  TM: "Turkmenistan",
  AZ: "Azerbaijan",
  GE: "Georgia",
};

const VISA_TONE: Record<RegionalMetric["visaBilateral"], string> = {
  "visa-free": "text-[var(--color-pos)] bg-[var(--color-pos-soft)]",
  "e-visa": "text-[var(--color-primary)] bg-[var(--color-primary-soft)]",
  standard: "text-[var(--color-ink-muted)] bg-[var(--color-surface-2)]",
};

const GSP_TONE: Record<RegionalMetric["gspStatus"], string> = {
  beneficiary: "text-[var(--color-pos)] bg-[var(--color-pos-soft)]",
  "eligible-pending": "text-[var(--color-warn)] bg-[var(--color-warn-soft)]",
  graduated: "text-[var(--color-ink-muted)] bg-[var(--color-surface-2)]",
  "n/a": "text-[var(--color-ink-faint)] bg-[var(--color-surface-2)]",
};

function rankOf(rows: RegionalMetric[], metric: MetricKey, country: RegionalMetric["country"]) {
  const sorted = [...rows].sort((a, b) => b[metric] - a[metric]);
  return sorted.findIndex((r) => r.country === country) + 1;
}

export function BenchmarkView() {
  const [metric, setMetric] = useState<MetricKey>("tradeWithUsUsdBn");
  const [chartOpen, setChartOpen] = useState(false);
  const active = METRICS.find((m) => m.key === metric)!;

  // React 19.2 + React Compiler auto-memoizes this; no explicit useMemo needed.
  const sorted = [...benchmark].sort((a, b) => b[metric] - a[metric]);

  const uz = benchmark.find((b) => b.country === "UZ")!;
  const uzRank = rankOf(benchmark, metric, "UZ");
  const peerAvg =
    benchmark.filter((b) => b.country !== "UZ").reduce((s, b) => s + b[metric], 0) / (benchmark.length - 1);
  const uzVsPeer = ((uz[metric] - peerAvg) / peerAvg) * 100;

  const chartData = sorted.map((r) => ({
    name: r.country,
    label: `${r.flagEmoji} ${r.country}`,
    value: r[metric],
    is_demo: r.is_demo,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="stat-label">UZ rank · {active.label}</div>
          <div className="serif mt-1 text-[28px] font-semibold leading-none tracking-tight text-[var(--color-ink)]">
            #{uzRank} <span className="text-[15px] text-[var(--color-ink-muted)]">of {benchmark.length}</span>
          </div>
          <div className="mt-1 text-[11px] text-[var(--color-ink-muted)]">among Central Asia + South Caucasus</div>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="stat-label">UZ value</div>
          <div className="serif mt-1 text-[28px] font-semibold leading-none tracking-tight text-[var(--color-ink)] tabular">
            {active.format(uz[metric])}
          </div>
          <div className="mt-1 text-[11px] text-[var(--color-ink-muted)]">{active.label}</div>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="stat-label">vs. peer average</div>
          <div
            className={cn(
              "serif mt-1 flex items-center gap-1.5 text-[28px] font-semibold leading-none tracking-tight tabular",
              uzVsPeer > 5
                ? "text-[var(--color-pos)]"
                : uzVsPeer < -5
                  ? "text-[var(--color-neg)]"
                  : "text-[var(--color-ink-muted)]",
            )}
          >
            {uzVsPeer > 0 ? (
              <ArrowUp className="size-5" />
            ) : uzVsPeer < 0 ? (
              <ArrowDown className="size-5" />
            ) : (
              <Minus className="size-5" />
            )}
            {Math.abs(uzVsPeer).toFixed(1)}%
          </div>
          <div className="mt-1 text-[11px] text-[var(--color-ink-muted)]">peer mean {active.format(peerAvg)}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Metric:</span>
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMetric(m.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition",
              m.key === metric
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-ink)]">{active.label}</div>
            <div className="text-[11px] text-[var(--color-ink-muted)]">
              Ranked across Uzbekistan + 6 regional peers · {active.unit}
            </div>
          </div>
        </div>
        <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
          <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            The ranked bar chart is preserved for visual comparison, but it now loads only when requested so the
            benchmark page can render its KPI and heatmap view before Recharts hydrates.
          </p>
          <button
            type="button"
            onClick={() => setChartOpen((value) => !value)}
            aria-expanded={chartOpen}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
          >
            <BarChart3 className="size-3.5" aria-hidden />
            {chartOpen ? "Hide chart" : "Load ranked chart"}
            <ChevronDown className={cn("size-3.5 transition", chartOpen && "rotate-180")} aria-hidden />
          </button>
        </div>
        {chartOpen ? (
          <LazyMount minHeight={280} rootMargin="0px" className="mt-4">
            <BenchmarkChart data={chartData} format={active.format} metricLabel={active.label} />
          </LazyMount>
        ) : null}
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <div className="text-[13px] font-semibold text-[var(--color-ink)]">Heatmap · all metrics</div>
          <div className="text-[11px] text-[var(--color-ink-muted)]">
            Each row normalized 0–100 across countries. Darker = stronger position.
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Metric
                </th>
                {benchmark.map((c) => (
                  <th
                    key={c.country}
                    className={cn(
                      "border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-center text-[10.5px] font-semibold uppercase tracking-wider",
                      c.country === "UZ" ? "text-[var(--color-primary)]" : "text-[var(--color-ink-muted)]",
                    )}
                  >
                    <div className="text-[14px]">{c.flagEmoji}</div>
                    <div>{c.country}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => {
                const values = benchmark.map((c) => c[m.key]);
                const localMin = Math.min(...values);
                const localMax = Math.max(...values);
                return (
                  <tr key={m.key}>
                    <td className="sticky left-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[11.5px] font-medium text-[var(--color-ink)]">
                      {m.label}
                    </td>
                    {benchmark.map((c) => {
                      const v = c[m.key];
                      const norm = localMax === localMin ? 0.5 : (v - localMin) / (localMax - localMin);
                      const intensity = 0.06 + norm * 0.3;
                      return (
                        <td
                          key={c.country}
                          className={cn(
                            "border-b border-[var(--color-border)] px-3 py-2 text-center text-[11.5px] tabular",
                            c.country === "UZ" ? "font-semibold" : "",
                          )}
                          style={{
                            background: `color-mix(in oklab, var(--color-primary) ${(intensity * 100).toFixed(0)}%, transparent)`,
                            color: "var(--color-ink)",
                          }}
                        >
                          {m.format(v)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <div className="text-[13px] font-semibold text-[var(--color-ink)]">Diplomatic & trade posture</div>
          <div className="text-[11px] text-[var(--color-ink-muted)]">Ease-of-business · visa regime · GSP standing</div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col" className="text-right">WB Rank</th>
                <th scope="col">Visa</th>
                <th scope="col">GSP</th>
                <th scope="col" className="text-right">Trade · US ($Bn)</th>
                <th scope="col" className="text-right">FDI · US ($M)</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.country} className={cn(c.country === "UZ" && "bg-[var(--color-primary-soft)]/40")}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px]">{c.flagEmoji}</span>
                      <div>
                        <div className={cn("font-medium", c.country === "UZ" && "text-[var(--color-primary)]")}>
                          {COUNTRY_NAME[c.country]}
                        </div>
                        <div className="mono text-[10.5px] text-[var(--color-ink-faint)]">{c.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right tabular mono">{c.wbDoingBusinessRank ?? "—"}</td>
                  <td>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                        VISA_TONE[c.visaBilateral],
                      )}
                    >
                      {c.visaBilateral}
                    </span>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                        GSP_TONE[c.gspStatus],
                      )}
                    >
                      {c.gspStatus}
                    </span>
                  </td>
                  <td className="text-right tabular mono">${c.tradeWithUsUsdBn.toFixed(2)}B</td>
                  <td className="text-right tabular mono">${c.fdiFromUsUsdM.toLocaleString()}M</td>
                  <td>{c.is_demo ? <DemoBadge /> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="text-[13px] font-semibold text-[var(--color-ink)]">Strategic read</div>
        <ul className="mt-2 flex flex-col gap-1.5 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
          <li>
            • <span className="text-[var(--color-ink)]">Trade headroom:</span> UZ–US turnover at $1.0B trails KZ ($3.1B)
            and GE ($1.8B); peer-average gap of {uzVsPeer < 0 ? `${Math.abs(uzVsPeer).toFixed(0)}% below` : "n/a"}{" "}
            indicates substantial expansion potential, especially in critical-minerals exports.
          </li>
          <li>
            • <span className="text-[var(--color-ink)]">FDI runway:</span> US cumulative FDI ($1.8B) is mid-pack;
            doubling to KZ-tier would require sustained C5+1 plus bilateral commitments through 2030.
          </li>
          <li>
            • <span className="text-[var(--color-ink)]">GSP positioning:</span> &quot;eligible-pending&quot; status is
            the single highest-leverage policy lever — graduation to beneficiary unlocks duty-free access for ~5,000 HS
            lines.
          </li>
          <li>
            • <span className="text-[var(--color-ink)]">Visa regime:</span> e-visa is a competitive disadvantage vs.
            KZ/KG/GE visa-free; bilateral simplification would compound business-travel growth.
          </li>
        </ul>
      </div>
    </div>
  );
}
