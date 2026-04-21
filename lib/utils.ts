import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtUsd(value: number, opts: { compact?: boolean; decimals?: number } = {}): string {
  const { compact = false, decimals = 1 } = opts;
  if (compact && Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`;
  if (compact && Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`;
  if (compact && Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(decimals)}K`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function fmtMillions(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
}

export function fmtPct(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function fmtNumber(value: number, decimals = 0): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function deltaColor(value: number): "pos" | "neg" | "neu" {
  if (value > 0.1) return "pos";
  if (value < -0.1) return "neg";
  return "neu";
}

export function daysBetween(a: Date | string, b: Date | string = new Date()): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return Math.floor((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

export function pluralizeDays(n: number, locale: string): string {
  if (locale.startsWith("en")) return `${n.toLocaleString("en-US")} day${n === 1 ? "" : "s"}`;
  if (locale.startsWith("ru") || locale.startsWith("uz-cyrl")) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return `${n.toLocaleString("ru-RU")} день`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n.toLocaleString("ru-RU")} дня`;
    return `${n.toLocaleString("ru-RU")} дней`;
  }
  return `${n} kun`;
}
