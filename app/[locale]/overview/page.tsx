import { permanentRedirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type QueryValue = string | string[] | undefined;

/**
 * The executive home now owns the Overview role. Keep this route only as a
 * stable, query-preserving redirect so old bookmarks remain predictable.
 */
export default async function OverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, QueryValue>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== undefined) query.set(key, value);
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  permanentRedirect(`/${locale}${suffix}`);
}
