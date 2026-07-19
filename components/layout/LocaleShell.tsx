"use client";

import { usePathname } from "next/navigation";
import { SearchCommandLazy } from "./SearchCommandLazy";
import { SettingsSync } from "./SettingsSync";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * Keeps the established public shell intact while allowing V2 control-room
 * routes to own their denser, task-oriented application chrome. The split is
 * deliberately route-scoped so V2 can migrate screen by screen.
 */
export function LocaleShell({ children, locale }: { children: React.ReactNode; locale: string }) {
  const pathname = usePathname();
  const isControlRoom = pathname === `/${locale}/today` || pathname.startsWith(`/${locale}/today/`);

  if (isControlRoom) {
    return (
      <>
        {children}
        <SettingsSync locale={locale} />
      </>
    );
  }

  return (
    <>
      <div className="command-shell flex min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="relative z-[1] flex-1 px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">{children}</main>
        </div>
      </div>
      <SearchCommandLazy />
      <SettingsSync locale={locale} />
    </>
  );
}
