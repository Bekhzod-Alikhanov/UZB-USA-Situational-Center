import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Lock, AlertTriangle } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { login } from "./actions";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "adminLogin" });
}

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { locale } = await params;
  const { from, error } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin.login" });

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <Lock className="size-4 text-[var(--color-primary)]" />
              {t("title")}
            </span>
          }
          sub={t("subtitle")}
        />
        <CardBody>
          <form action={login} className="flex flex-col gap-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="from" value={from ?? ""} />

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                {t("password")}
              </span>
              <input
                type="password"
                name="password"
                autoFocus
                required
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[14px] text-[var(--color-ink)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </label>

            {error ? (
              <div className="flex items-start gap-2 rounded-md border border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] px-3 py-2 text-[12px] text-[var(--color-neg)]">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <span>{error === "config" ? t("errors.config") : t("errors.password")}</span>
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[var(--color-primary-2)]"
            >
              {t("submit")}
            </button>

            <p className="text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
              {t("environmentNote", { passwordVar: "ADMIN_PASSWORD", sessionVar: "ADMIN_SESSION_SECRET" })}
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
