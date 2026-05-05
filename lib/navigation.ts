import type { ComponentType } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  ClipboardList,
  Cog,
  FileText,
  Gauge,
  Gift,
  Globe2,
  Landmark,
  Lightbulb,
  LineChart,
  ListChecks,
  Newspaper,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  UsersRound,
  UserSquare,
} from "lucide-react";

export type NavTone = "trade" | "visits" | "invest" | "agree" | "people" | "rose" | "slate" | "primary";
export type NavAudience = "executive" | "analyst" | "business" | "diplomacy" | "advanced" | "operations";

export interface NavItem {
  key: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  tone: NavTone;
  audience: NavAudience;
  descriptionKey?: string;
}

export interface NavGroup {
  key: string;
  icon: ComponentType<{ className?: string }>;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "executive",
    icon: Activity,
    items: [{ key: "overview", href: "", icon: Activity, tone: "primary", audience: "executive" }],
  },
  {
    key: "economic",
    icon: LineChart,
    items: [
      { key: "trade", href: "/trade", icon: BarChart3, tone: "trade", audience: "business" },
      { key: "investments", href: "/investments", icon: Briefcase, tone: "invest", audience: "business" },
      { key: "sectors", href: "/sectors", icon: Lightbulb, tone: "agree", audience: "business" },
    ],
  },
  {
    key: "diplomacy",
    icon: Landmark,
    items: [
      { key: "visits", href: "/visits", icon: Target, tone: "visits", audience: "diplomacy" },
      { key: "agreements", href: "/agreements", icon: FileText, tone: "agree", audience: "diplomacy" },
      { key: "events", href: "/events", icon: Calendar, tone: "agree", audience: "diplomacy" },
      { key: "counterparts", href: "/counterparts", icon: UserSquare, tone: "visits", audience: "diplomacy" },
      { key: "contacts", href: "/contacts", icon: Users, tone: "people", audience: "diplomacy" },
    ],
  },
  {
    key: "risks",
    icon: ListChecks,
    items: [
      { key: "commitments", href: "/commitments", icon: ClipboardList, tone: "rose", audience: "operations" },
      { key: "compliance", href: "/compliance", icon: ShieldCheck, tone: "slate", audience: "business" },
      { key: "grants", href: "/grants", icon: Gift, tone: "invest", audience: "analyst" },
      { key: "news", href: "/news", icon: Newspaper, tone: "rose", audience: "analyst" },
    ],
  },
  {
    key: "advanced",
    icon: BookOpen,
    items: [
      { key: "map", href: "/map", icon: Globe2, tone: "people", audience: "advanced" },
      { key: "benchmark", href: "/benchmark", icon: Gauge, tone: "slate", audience: "advanced" },
    ],
  },
  {
    key: "operations",
    icon: Cog,
    items: [
      { key: "prepare", href: "/prepare", icon: ClipboardList, tone: "visits", audience: "operations" },
      { key: "staff", href: "/staff", icon: UsersRound, tone: "people", audience: "operations" },
      { key: "assistant", href: "/assistant", icon: Sparkles, tone: "primary", audience: "advanced" },
      { key: "admin", href: "/admin", icon: Settings, tone: "slate", audience: "operations" },
    ],
  },
];

export const TONE_VAR_MAP: Record<NavTone, string> = {
  trade: "var(--color-trade)",
  visits: "var(--color-visits)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  people: "var(--color-people)",
  rose: "var(--color-rose)",
  slate: "var(--color-slate)",
  primary: "var(--color-primary)",
};

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    groupKey: group.key,
  })),
);

export function localizedHref(locale: string, href: string) {
  return `/${locale}${href}`;
}
