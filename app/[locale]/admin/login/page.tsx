import { setRequestLocale } from "next-intl/server";
import { Lock, AlertTriangle } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { login } from "./actions";

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

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <Lock className="size-4 text-[var(--color-primary)]" />
              Admin sign-in
            </span>
          }
          sub="Restricted to Situational Center personnel"
        />
        <CardBody>
          <form action={login} className="flex flex-col gap-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="from" value={from ?? ""} />

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Password
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
                <span>
                  {error === "config"
                    ? "Admin access is not configured. Set ADMIN_PASSWORD before signing in."
                    : "Incorrect password. Try again."}
                </span>
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[var(--color-primary-2)]"
            >
              Sign in
            </button>

            <p className="text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
              Admin access requires the{" "}
              <code className="mono rounded bg-[var(--color-surface-2)] px-1">ADMIN_PASSWORD</code>{" "}
              environment variable. Production deployments should also set{" "}
              <code className="mono rounded bg-[var(--color-surface-2)] px-1">ADMIN_SESSION_SECRET</code>.
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
