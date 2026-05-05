"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Landmark, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { localizedHref, NAV_GROUPS, TONE_VAR_MAP } from "@/lib/navigation";
import { TimezoneClocks } from "./TimezoneClocks";

export function Sidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tGroups = useTranslations("navGroups");

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex">
      {/* Brand */}
      <div className="border-b border-[var(--color-border)] px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-9 items-center justify-center rounded-lg text-[11px] font-bold tracking-tight text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), color-mix(in oklab, var(--color-visits) 70%, var(--color-primary)))",
              boxShadow: "0 4px 10px color-mix(in oklab, var(--color-primary) 30%, transparent)",
            }}
          >
            UZ<span className="opacity-60">·</span>US
          </div>
          <div className="leading-tight">
            <div className="serif text-[15px] font-medium text-[var(--color-ink)]">{tBrand("title")}</div>
            <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-muted)]">
              {tBrand("subtitle")}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.key} className="mb-4 last:mb-2">
              <div className="flex items-center gap-1.5 px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                <GroupIcon className="size-3 opacity-60" />
                {tGroups(group.key)}
              </div>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const href = localizedHref(locale, item.href);
                  const isActive =
                    item.href === ""
                      ? pathname === `/${locale}` || pathname === `/${locale}/`
                      : pathname === href || pathname.startsWith(`${href}/`);
                  const Icon = item.icon;
                  const toneVar = TONE_VAR_MAP[item.tone];
                  return (
                    <li key={item.key}>
                      <Link
                        href={href}
                        prefetch={false}
                        style={isActive ? ({ "--side-tone": toneVar } as React.CSSProperties) : undefined}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition",
                          isActive
                            ? "text-[var(--color-ink)]"
                            : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]",
                        )}
                      >
                        {isActive ? (
                          <>
                            <span
                              aria-hidden
                              className="absolute inset-0 -z-0 rounded-lg"
                              style={{
                                background: "color-mix(in oklab, var(--side-tone) 12%, transparent)",
                                border: "1px solid color-mix(in oklab, var(--side-tone) 22%, transparent)",
                              }}
                            />
                            <span
                              aria-hidden
                              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                              style={{ background: "var(--side-tone)" }}
                            />
                          </>
                        ) : null}
                        <span
                          className={cn(
                            "relative z-10 inline-flex shrink-0 transition",
                            isActive ? "" : "text-[var(--color-ink-faint)] group-hover:text-[var(--color-ink-muted)]",
                          )}
                          style={isActive ? { color: toneVar } : undefined}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="relative z-10 truncate">{tNav(item.key)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Timezone clocks */}
      <div className="border-t border-[var(--color-border)] px-3 py-2">
        <TimezoneClocks />
      </div>

      {/* Brand footer */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5">
        <div className="flex items-center gap-2 text-[10.5px] text-[var(--color-ink-muted)]">
          <MapPin className="size-3" />
          <span>Tashkent · Presidential Administration</span>
        </div>
        <div className="mt-1 text-[10px] text-[var(--color-ink-faint)]">
          <Landmark className="mr-1 inline size-2.5" />
          Ф-4 · 17.02.2026
        </div>
      </div>
    </aside>
  );
}
