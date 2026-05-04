import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Compass className="size-5" />
        </div>
        <div className="serif text-[22px] font-medium tracking-tight text-[var(--color-ink)]">Page not found</div>
        <div className="mt-1 text-[13px] text-[var(--color-ink-muted)]">
          The route you requested isn&apos;t part of this dashboard. Try the overview page.
        </div>
        <Link
          href="/en"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-2 text-[12.5px] font-medium text-white transition hover:bg-[var(--color-primary-2)]"
        >
          Go to overview
        </Link>
      </div>
    </div>
  );
}
