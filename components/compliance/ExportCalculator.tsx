"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";

type Eccn = "EAR99" | "1C350" | "3A001" | "5A002" | "9A610";
type EndUse = "civilian" | "dual" | "military";
type Sanctioned = "no" | "possibly" | "yes";

const LICENSE_MATRIX: Record<Eccn, Record<EndUse, Record<Sanctioned, { verdict: "ok" | "review" | "denied"; note: string }>>> = {
  EAR99: {
    civilian: {
      no: { verdict: "ok", note: "No license generally required. Routine screening against SDN list." },
      possibly: { verdict: "review", note: "Conduct enhanced due diligence; screen end-user against SDN." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    dual: {
      no: { verdict: "review", note: "End-use statement recommended; confirm no military diversion risk." },
      possibly: { verdict: "review", note: "Obtain end-use / end-user statement; escalate if uncertainty remains." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    military: {
      no: { verdict: "review", note: "Military end-use may trigger §744.21 review for listed destinations." },
      possibly: { verdict: "denied", note: "Military end-use plus sanctions exposure — reject pending BIS guidance." },
      yes: { verdict: "denied", note: "SDN + military end-use. Transaction prohibited." },
    },
  },
  "1C350": {
    civilian: {
      no: { verdict: "review", note: "License required; submit CCATS and end-use review." },
      possibly: { verdict: "review", note: "License required; submit CCATS and end-use review." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    dual: {
      no: { verdict: "review", note: "License required; end-use review mandatory." },
      possibly: { verdict: "review", note: "License required; end-use review mandatory." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    military: {
      no: { verdict: "denied", note: "Chemical precursors for military use — policy of denial." },
      possibly: { verdict: "denied", note: "Chemical precursors for military use — policy of denial." },
      yes: { verdict: "denied", note: "Chemical precursors for military use — policy of denial." },
    },
  },
  "3A001": {
    civilian: {
      no: { verdict: "review", note: "License required above de-minimis thresholds. Consult BIS." },
      possibly: { verdict: "review", note: "License required; enhanced screening of end-user." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    dual: {
      no: { verdict: "review", note: "License required; end-use review and diversion risk analysis." },
      possibly: { verdict: "review", note: "License required; enhanced scrutiny." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    military: {
      no: { verdict: "denied", note: "Advanced semiconductors for military use — presumption of denial." },
      possibly: { verdict: "denied", note: "Advanced semiconductors for military use — presumption of denial." },
      yes: { verdict: "denied", note: "Advanced semiconductors for military use — presumption of denial." },
    },
  },
  "5A002": {
    civilian: {
      no: { verdict: "review", note: "License Exception ENC may apply. Validate self-classification." },
      possibly: { verdict: "review", note: "License required; screen end-user." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    dual: {
      no: { verdict: "review", note: "License exception ENC sometimes applies; confirm use-case." },
      possibly: { verdict: "review", note: "License required." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    military: {
      no: { verdict: "denied", note: "Encryption for military use — presumption of denial." },
      possibly: { verdict: "denied", note: "Encryption for military use — presumption of denial." },
      yes: { verdict: "denied", note: "Encryption for military use — presumption of denial." },
    },
  },
  "9A610": {
    civilian: {
      no: { verdict: "review", note: "ITAR / USML review. Most items denied to non-allies." },
      possibly: { verdict: "denied", note: "ITAR + sanctions exposure — denied." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    dual: {
      no: { verdict: "denied", note: "Defense articles — DDTC licensing required; policy of denial likely." },
      possibly: { verdict: "denied", note: "Defense articles + sanctions exposure — denied." },
      yes: { verdict: "denied", note: "SDN-listed end-user. Transaction prohibited." },
    },
    military: {
      no: { verdict: "denied", note: "Defense articles — DDTC denial absent Presidential waiver." },
      possibly: { verdict: "denied", note: "Defense articles + sanctions exposure — denied." },
      yes: { verdict: "denied", note: "Defense articles + SDN — denied." },
    },
  },
};

const VERDICT_STYLE = {
  ok: {
    tone: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
    Icon: ShieldCheck,
    label: "Likely permitted",
  },
  review: {
    tone: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
    Icon: TriangleAlert,
    label: "Requires review",
  },
  denied: {
    tone: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
    Icon: ShieldAlert,
    label: "Likely denied",
  },
} as const;

export function ExportCalculator() {
  const [eccn, setEccn] = useState<Eccn>("EAR99");
  const [endUse, setEndUse] = useState<EndUse>("civilian");
  const [sanctioned, setSanctioned] = useState<Sanctioned>("no");

  const result = useMemo(() => LICENSE_MATRIX[eccn][endUse][sanctioned], [eccn, endUse, sanctioned]);
  const { tone, Icon, label } = VERDICT_STYLE[result.verdict];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.3fr]">
      <div className="flex flex-col gap-3">
        <Field label="ECCN">
          <select
            value={eccn}
            onChange={(e) => setEccn(e.target.value as Eccn)}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-[12.5px]"
          >
            {(["EAR99", "1C350", "3A001", "5A002", "9A610"] as Eccn[]).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>

        <Field label="End-use">
          <div className="flex gap-1">
            {(["civilian", "dual", "military"] as EndUse[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setEndUse(v)}
                className={cn(
                  "flex-1 rounded-md border px-2 py-1.5 text-[11.5px] font-medium transition",
                  endUse === v
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </Field>

        <Field label="End-user on SDN list">
          <div className="flex gap-1">
            {(["no", "possibly", "yes"] as Sanctioned[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSanctioned(v)}
                className={cn(
                  "flex-1 rounded-md border px-2 py-1.5 text-[11.5px] font-medium transition",
                  sanctioned === v
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className={cn("flex flex-col gap-2 rounded-lg border p-4", tone)}>
        <div className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-wider">
          <Icon className="size-4" />
          {label}
        </div>
        <p className="text-[13px] leading-relaxed">{result.note}</p>
        <p className="mt-2 text-[10.5px] italic opacity-80">
          Simplified illustrative calculator. Actual licensing is determined by BIS / DDTC / OFAC — confirm with counsel.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</span>
      {children}
    </label>
  );
}
