import { permanentRedirect } from "next/navigation";

/**
 * The executive brief moved to the site root in the brief-home pass.
 * This stub keeps old bookmarks and shared links alive.
 */
export default async function BriefRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(`/${locale}`);
}
