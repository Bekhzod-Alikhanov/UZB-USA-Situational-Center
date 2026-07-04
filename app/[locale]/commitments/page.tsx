import { permanentRedirect } from "next/navigation";

/**
 * The demo commitments registry was replaced by the regional roadmaps
 * monitor in the roadmaps-monitoring pass. This stub keeps old bookmarks
 * and shared links alive.
 */
export default async function CommitmentsRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/roadmaps`);
}
