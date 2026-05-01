"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Globe2, Map as MapIcon, Briefcase, TrendingUp, Users2 } from "lucide-react";

// Reserve the same 560 px height while the chunk + tiles load — otherwise
// the basemap snaps in late and Lighthouse measures a CLS of ~0.2.
const MapPlaceholder = () => (
  <div
    className="h-[560px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]"
    aria-busy="true"
  />
);

const FlatMap = dynamic(() => import("./FlatMap").then((m) => m.FlatMap), {
  ssr: false,
  loading: MapPlaceholder,
});
const Globe3D = dynamic(() => import("@/components/overview/Globe3D").then((m) => m.Globe3D), {
  ssr: false,
  loading: MapPlaceholder,
});

type Layer = "invest" | "trade" | "delegations";

export function MapClient() {
  const [mode, setMode] = useState<"flat" | "globe">("flat");
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    invest: true,
    trade: true,
    delegations: true,
  });
  const toggle = (k: Layer) => setLayers((l) => ({ ...l, [k]: !l[k] }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
          <ModeBtn
            active={mode === "flat"}
            onClick={() => setMode("flat")}
            icon={<MapIcon className="size-3.5" />}
            label="Flat map"
          />
          <ModeBtn
            active={mode === "globe"}
            onClick={() => setMode("globe")}
            icon={<Globe2 className="size-3.5" />}
            label="3D globe"
          />
        </div>

        {mode === "flat" ? (
          <div className="flex items-center gap-1.5">
            <LayerBtn active={layers.invest} onClick={() => toggle("invest")} tone="primary" icon={<Briefcase className="size-3" />}>
              Investments
            </LayerBtn>
            <LayerBtn active={layers.trade} onClick={() => toggle("trade")} tone="warn" icon={<TrendingUp className="size-3" />}>
              Trade arcs
            </LayerBtn>
            <LayerBtn active={layers.delegations} onClick={() => toggle("delegations")} tone="neg" icon={<Users2 className="size-3" />}>
              Delegations
            </LayerBtn>
          </div>
        ) : null}

        <div className="ml-auto text-[10.5px] text-[var(--color-ink-muted)]">
          Tiles: OpenFreeMap (CC-BY) · Data: MIIT + Situational Center
        </div>
      </div>

      {mode === "flat" ? (
        <FlatMap activeLayers={layers} />
      ) : (
        <div className="rounded-md border border-[var(--color-border)] bg-[#0a0d15]">
          <Globe3D height={560} />
        </div>
      )}
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-medium transition",
        active ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function LayerBtn({
  active,
  onClick,
  icon,
  children,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  tone: "primary" | "warn" | "neg";
}) {
  const dotColor =
    tone === "primary"
      ? "bg-[var(--color-primary)]"
      : tone === "warn"
        ? "bg-[var(--color-warn)]"
        : "bg-[var(--color-neg)]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11.5px] font-medium transition",
        active
          ? "border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-ink)]"
          : "border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-faint)] line-through",
      )}
    >
      <span className={cn("size-1.5 rounded-full", active ? dotColor : "bg-[var(--color-ink-faint)]")} />
      {icon}
      {children}
    </button>
  );
}
