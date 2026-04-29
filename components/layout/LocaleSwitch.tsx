"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function LocaleSwitch() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const current = localeMeta[locale];

  function switchLocale(next: Locale) {
    const segments = pathname.split("/");
    segments[1] = next;
    const nextPath = segments.join("/") || `/${next}`;
    startTransition(() => router.replace(nextPath));
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Switch language"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-surface-2)]",
            pending && "opacity-60",
          )}
        >
          <span>{current.flag}</span>
          <span className="tabular">{current.code}</span>
          <ChevronDown className="size-3 text-[var(--color-ink-muted)]" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[180px] rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-hover)]"
        >
          {locales.map((l) => {
            const meta = localeMeta[l];
            return (
              <DropdownMenu.Item
                key={l}
                onSelect={() => switchLocale(l)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none",
                  l === locale
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]",
                )}
              >
                <span>{meta.flag}</span>
                <span className="flex-1">{meta.label}</span>
                <span className="text-[10px] text-[var(--color-ink-muted)] tabular">{meta.code}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
