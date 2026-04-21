"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
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
  MapPin,
  Newspaper,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  UsersRound,
  UserSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  key: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    key: "monitoring",
    items: [
      { key: "overview", href: "", icon: Activity },
      { key: "trade", href: "/trade", icon: BarChart3 },
      { key: "investments", href: "/investments", icon: Briefcase },
      { key: "map", href: "/map", icon: Globe2 },
      { key: "benchmark", href: "/benchmark", icon: Gauge },
    ],
  },
  {
    key: "execution",
    items: [
      { key: "visits", href: "/visits", icon: Target },
      { key: "prepare", href: "/prepare", icon: ClipboardList },
      { key: "commitments", href: "/commitments", icon: ClipboardList },
      { key: "events", href: "/events", icon: Calendar },
      { key: "grants", href: "/grants", icon: Gift },
    ],
  },
  {
    key: "knowledge",
    items: [
      { key: "agreements", href: "/agreements", icon: FileText },
      { key: "compliance", href: "/compliance", icon: ShieldCheck },
      { key: "counterparts", href: "/counterparts", icon: UserSquare },
      { key: "contacts", href: "/contacts", icon: Users },
      { key: "news", href: "/news", icon: Newspaper },
    ],
  },
  {
    key: "internal",
    items: [
      { key: "staff", href: "/staff", icon: UsersRound },
      { key: "assistant", href: "/assistant", icon: Sparkles },
      { key: "admin", href: "/admin", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tGroups = useTranslations("navGroups");

  const base = `/${locale}`;

  return (
    <aside className="sticky top-0 flex h-screen w-[252px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-4 py-4">
        <div className="flex size-9 items-center justify-center rounded-md bg-[var(--color-primary)] text-[11px] font-bold tracking-tight text-white">
          UZ<span className="opacity-60">·</span>US
        </div>
        <div className="leading-tight">
          <div className="serif text-[15px] font-medium text-[var(--color-ink)]">{tBrand("title")}</div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)]">
            {tBrand("subtitle")}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.key} className="mb-4 last:mb-2">
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
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
                return (
                  <li key={item.key}>
                    <Link
                      href={href}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition",
                        isActive
                          ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                          : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive ? "text-[var(--color-primary)]" : "text-[var(--color-ink-faint)]",
                        )}
                      />
                      <span className="truncate">{tNav(item.key)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] px-4 py-3">
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
