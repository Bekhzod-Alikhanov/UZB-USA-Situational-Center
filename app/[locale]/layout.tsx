import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SearchCommandLazy } from "@/components/layout/SearchCommandLazy";
import { SettingsSync } from "@/components/layout/SettingsSync";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale as Locale} messages={messages}>
      <div className="command-shell flex min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="relative z-[1] flex-1 px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">{children}</main>
        </div>
      </div>
      <SearchCommandLazy />
      <SettingsSync locale={locale} />
    </NextIntlClientProvider>
  );
}
