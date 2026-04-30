"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  ClipboardList,
  FileText,
  Gauge,
  Gift,
  Globe2,
  Landmark,
  Lightbulb,
  MapPin,
  Newspaper,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  UsersRound,
  UserSquare,
  LineChart,
  ListChecks,
  BookOpen,
  Cog,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "trade" | "visits" | "invest" | "agree" | "people" | "rose" | "slate" | "primary";
}

interface NavGroup {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    key: "monitoring",
    icon: LineChart,
    items: [
      { key: "overview", href: "", icon: Activity, tone: "primary" },
      { key: "trade", href: "/trade", icon: BarChart3, tone: "trade" },
      { key: "investments", href: "/investments", icon: Briefcase, tone: "invest" },
      { key: "map", href: "/map", icon: Globe2, tone: "people" },
      { key: "benchmark", href: "/benchmark", icon: Gauge, tone: "slate" },
    ],
  },
  {
    key: "execution",
    icon: ListChecks,
    items: [
      { key: "visits", href: "/visits", icon: Target, tone: "visits" },
      { key: "prepare", href: "/prepare", icon: ClipboardList, tone: "visits" },
      { key: "commitments", href: "/commitments", icon: ClipboardList, tone: "rose" },
      { key: "events", href: "/events", icon: Calendar, tone: "agree" },
      { key: "grants", href: "/grants", icon: Gift, tone: "invest" },
    ],
  },
  {
    key: "knowledge",
    icon: BookOpen,
    items: [
      { key: "agreements", href: "/agreements", icon: FileText, tone: "agree" },
      { key: "sectors", href: "/sectors", icon: Lightbulb, tone: "agree" },
      { key: "compliance", href: "/compliance", icon: ShieldCheck, tone: "slate" },
      { key: "counterparts", href: "/counterparts", icon: UserSquare, tone: "visits" },
      { key: "contacts", href: "/contacts", icon: Users, tone: "people" },
      { key: "news", href: "/news", icon: Newspaper, tone: "rose" },
    ],
  },
  {
    key: "internal",
    icon: Cog,
    items: [
      { key: "staff", href: "/staff", icon: UsersRound, tone: "people" },
      { key: "assistant", href: "/assistant", icon: Sparkles, tone: "primary" },
      { key: "admin", href: "/admin", icon: Settings, tone: "slate" },
    ],
  },
];

const TONE_VAR_MAP: Record<NonNullable<NavItem["tone"]>, string> = {
  trade: "var(--color-trade)",
  visits: "var(--color-visits)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  people: "var(--color-people)",
  rose: "var(--color-rose)",
  slate: "var(--color-slate)",
  primary: "var(--color-primary)",
};

interface MobileSidebarProps {
  trigger: React.ReactNode;
}

export function MobileSidebar({ trigger }: MobileSidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tGroups = useTranslations("navGroups");
  const [open, setOpen] = useState(false);
  // Track the previous pathname so the drawer closes only when the route
  // actually changes (not on initial mount). This is "syncing UI to an
  // external system" (the router) — the canonical use of useEffect.
  // The lint rule complains because setState-in-effect is a code smell in
  // most cases, but here it's the correct pattern: we want to react to a
  // route change owned by the router, not a piece of our own state.
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  const base = `/${locale}`;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{tBrand("title")}</Dialog.Title>

          {/* Brand + close */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3.5">
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
            <Dialog.Close
              className="rounded-md p-1.5 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Dialog.Close>
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
                      const href = `${base}${item.href}`;
                      const isActive =
                        item.href === ""
                          ? pathname === base || pathname === `${base}/`
                          : pathname === href || pathname.startsWith(`${href}/`);
                      const Icon = item.icon;
                      const toneVar = item.tone ? TONE_VAR_MAP[item.tone] : "var(--color-primary)";
                      return (
                        <li key={item.key}>
                          <Link
                            href={href}
                            style={isActive ? ({ "--side-tone": toneVar } as React.CSSProperties) : undefined}
                            className={cn(
                              "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition",
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
                                isActive ? "" : "text-[var(--color-ink-faint)]",
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

          {/* Footer */}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
