import Link from "next/link";
import { complianceStatuses } from "@/data/compliance";

interface PostureTile {
  code: string;
  state: "clear" | "review" | "watch" | "hold";
  note: string;
}

const STATE_TONE = {
  clear: { c: "var(--color-pos)", bg: "var(--color-pos-soft)", lbl: "Clear" },
  review: { c: "var(--color-warn)", bg: "var(--color-warn-soft)", lbl: "Review" },
  watch: { c: "var(--color-warn)", bg: "var(--color-warn-soft)", lbl: "Watch" },
  hold: { c: "var(--color-neg)", bg: "var(--color-neg-soft)", lbl: "Hold" },
} as const;

/**
 * Map our richer compliance dataset (8+ statuses) to 6 daily-brief tiles
 * with traffic-light states. Each tile shows the regime code, a state
 * pill, and a one-line note.
 */
function build(): PostureTile[] {
  const map = new Map<string, ComplianceStatusItem>();
  for (const s of complianceStatuses) map.set(s.id, s);

  const lookup = (id: string, code: string, state: PostureTile["state"]): PostureTile | null => {
    const x = map.get(id);
    if (!x) return null;
    return { code, state, note: x.note };
  };

  const tiles: PostureTile[] = [];
  const ofac = lookup("ofac-sanctions", "OFAC", "clear");
  if (ofac) tiles.push(ofac);
  const ear = lookup("ear-country-group", "BIS-EAR", "clear");
  if (ear) tiles.push(ear);
  const itar = lookup("itar", "ITAR", "review");
  if (itar) tiles.push(itar);
  const gsp = lookup("gsp", "GSP", "watch");
  if (gsp) tiles.push(gsp);
  const mfn = lookup("mfn", "MFN", "clear");
  if (mfn) tiles.push(mfn);
  const eccn = lookup("ear-dual-use", "EAR-ECCN", "clear");
  if (eccn) tiles.push(eccn);
  return tiles;
}

interface ComplianceStatusItem {
  id: string;
  note: string;
}

/**
 * 6-tile compliance posture strip — daily-brief view of OFAC / BIS-EAR /
 * ITAR / GSP / MFN / EAR-ECCN. Click tile → /compliance.
 */
export function CompliancePosture({ locale }: { locale: string }) {
  const tiles = build();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((it) => {
        const s = STATE_TONE[it.state];
        return (
          <Link
            key={it.code}
            href={`/${locale}/compliance`}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 transition hover:bg-[var(--color-surface-2)] hover:shadow-[var(--shadow-hover)]"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="mono text-[10.5px] font-semibold tracking-wider text-[var(--color-ink)]">{it.code}</span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                style={{ background: s.bg, color: s.c }}
              >
                <span className="size-1 rounded-full" style={{ background: s.c }} />
                {s.lbl}
              </span>
            </div>
            <div className="text-[10.5px] leading-snug text-[var(--color-ink-muted)]">{it.note}</div>
          </Link>
        );
      })}
    </div>
  );
}
