"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface Exhibit {
  src: string;
  title: string;
  blurb: string;
  group: "potential" | "diversification";
  side: "uz-to-us" | "us-to-uz";
}

const EXHIBITS: Exhibit[] = [
  {
    src: "/trademap/uzbekistan-s-products-with-potential-to-united-states.png",
    title: "UZ products with export potential to the U.S. — overview",
    blurb:
      "ITC's Export Potential Indicator: products where Uzbekistan has competitive supply capacity that the U.S. market can absorb, plotted by potential value vs current exports.",
    group: "potential",
    side: "uz-to-us",
  },
  {
    src: "/trademap/uzbekistan-s-products-with-potential-to-united-states-1.png",
    title: "UZ export potential to the U.S. — by product detail",
    blurb: "Per-HS view of untapped export potential. Bubble size = potential, position = current vs target.",
    group: "potential",
    side: "uz-to-us",
  },
  {
    src: "/trademap/uzbekistan-s-products-with-potential-to-united-states-2.png",
    title: "UZ export potential — third view",
    blurb: "Alternative cut of the Export Potential Indicator (different filter or scale applied in Trade Map UI).",
    group: "potential",
    side: "uz-to-us",
  },
  {
    src: "/trademap/uzbekistan-s-diversification-products-for-export-to-united-states.png",
    title: "UZ diversification candidates for export to the U.S.",
    blurb:
      "Products that Uzbekistan does not yet export to the U.S. but plausibly could, based on neighbouring countries' competitive baskets and U.S. demand patterns.",
    group: "diversification",
    side: "uz-to-us",
  },
  {
    src: "/trademap/united-states-s-products-with-potential-to-uzbekistan.png",
    title: "U.S. products with export potential to Uzbekistan — overview",
    blurb: "Mirror analysis: where U.S. supply capacity could grow into the Uzbek market.",
    group: "potential",
    side: "us-to-uz",
  },
  {
    src: "/trademap/united-states-s-products-with-potential-to-uzbekistan-1.png",
    title: "U.S. export potential to UZ — by product detail",
    blurb: "Per-HS view from the U.S. side.",
    group: "potential",
    side: "us-to-uz",
  },
  {
    src: "/trademap/united-states-s-diversification-products-for-export-to-uzbekistan.png",
    title: "U.S. diversification candidates for export to Uzbekistan",
    blurb: "Categories where U.S. could expand into Uzbekistan based on global supply benchmarks.",
    group: "diversification",
    side: "us-to-uz",
  },
];

export function TrademapExhibits() {
  const [open, setOpen] = useState<Exhibit | null>(null);

  return (
    <>
      <p className="text-[11.5px] text-[var(--color-ink-muted)]">
        Trade Map&apos;s analytical layer goes beyond raw flows. The charts below — exported from the ITC UI — show
        the <strong>Export Potential Indicator</strong> (which products have realistic upside) and{" "}
        <strong>Product Diversification</strong> (which entirely new products could be added to the basket).
        Click any thumbnail to open full-size.
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {EXHIBITS.map((e) => (
          <button
            key={e.src}
            type="button"
            onClick={() => setOpen(e)}
            className={cn(
              "group relative flex flex-col gap-1.5 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-left transition hover:border-[var(--color-primary)]/40 hover:shadow-sm",
            )}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded bg-[var(--color-surface-2)]">
              <Image
                src={e.src}
                alt={e.title}
                fill
                className="object-cover transition group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute right-1.5 top-1.5 rounded bg-black/60 p-0.5 text-white opacity-0 transition group-hover:opacity-100">
                <ZoomIn className="size-3" />
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
            <h4 className="serif text-[12.5px] font-medium leading-snug text-[var(--color-ink)] line-clamp-2">
              {e.title}
            </h4>
          </button>
        ))}
      </div>

      <Dialog.Root open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[95vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-3">
              <div>
                <Dialog.Title className="serif text-[16px] font-semibold text-[var(--color-ink)]">
                  {open?.title}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
                  {open?.blurb}
                </Dialog.Description>
              </div>
              <Dialog.Close className="rounded-md border border-[var(--color-border)] p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]">
                <X className="size-4" />
              </Dialog.Close>
            </div>
            {open ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[var(--color-surface-2)]">
                <Image src={open.src} alt={open.title} fill className="object-contain" sizes="95vw" />
              </div>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
