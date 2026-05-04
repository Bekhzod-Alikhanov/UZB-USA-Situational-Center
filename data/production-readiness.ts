export type ReadinessStatus = "ready" | "partial" | "blocked";
export type ReadinessArea = "security" | "data" | "quality" | "operations" | "product";

export interface ReadinessItem {
  id: string;
  area: ReadinessArea;
  title: string;
  status: ReadinessStatus;
  why: string;
  next: string;
}

export const productionReadinessItems: ReadinessItem[] = [
  {
    id: "signed-admin-cookie",
    area: "security",
    title: "Signed admin cookie",
    status: "ready",
    why: "Admin sessions are no longer a static cookie value and the password has no unsafe default.",
    next: "Keep ADMIN_PASSWORD and ADMIN_SESSION_SECRET configured in Vercel.",
  },
  {
    id: "real-auth",
    area: "security",
    title: "Role-based identity",
    status: "partial",
    why: "The current password gate is acceptable for a protected demo, but not for multi-user government operations.",
    next: "Connect Microsoft Entra ID, Auth.js, Clerk, or another approved identity provider.",
  },
  {
    id: "source-registry",
    area: "data",
    title: "Source registry",
    status: "ready",
    why: "All sourceId references validate against the central registry.",
    next: "Require data-owner sign-off for each Level A internal source.",
  },
  {
    id: "live-data",
    area: "data",
    title: "Governed public-data connectors",
    status: "ready",
    why: "Official connectors now route through raw snapshots, normalized observations, relevance gates, and no-downgrade review policy.",
    next: "Provision credentials and approve source mappings before enabling write-mode cron in production.",
  },
  {
    id: "operational-db",
    area: "data",
    title: "Operational database",
    status: "partial",
    why: "The Postgres/Supabase schema now covers source snapshots, normalized observations, review queue, published metrics, and audit records.",
    next: "Provision Supabase/Neon/Postgres, apply schema.sql, set RLS/backup policies, and configure SUPABASE_* env vars.",
  },
  {
    id: "cron-ingestion",
    area: "operations",
    title: "Scheduled ingestion",
    status: "partial",
    why: "Vercel cron is configured for the governed ingestion endpoint, protected by CRON_SECRET.",
    next: "Set CRON_SECRET in Vercel and keep write mode off until the database and review process are approved.",
  },
  {
    id: "ci",
    area: "quality",
    title: "CI verification",
    status: "ready",
    why: "The project can run lint, typecheck, data validation, package hygiene, and production build.",
    next: "Enable the GitHub Actions workflow on the connected repository.",
  },
  {
    id: "e2e",
    area: "quality",
    title: "Browser e2e coverage",
    status: "partial",
    why: "Route smoke tests exist; full Playwright interaction tests are still a next phase.",
    next: "Add Playwright once dependency installation is approved for the repo.",
  },
  {
    id: "workflow",
    area: "operations",
    title: "Decision workflow",
    status: "partial",
    why: "The executive command center now surfaces actions, owners, and risks, but persistence is static.",
    next: "Move action status, comments, approvals, and audit history into the operational database.",
  },
  {
    id: "briefing",
    area: "product",
    title: "Executive briefing mode",
    status: "ready",
    why: "Overview now includes a daily command layer, relationship pillars, and source health.",
    next: "Add one-click DOCX/PPT briefing export in a later phase if required.",
  },
];

export function readinessSummary() {
  return {
    ready: productionReadinessItems.filter((item) => item.status === "ready").length,
    partial: productionReadinessItems.filter((item) => item.status === "partial").length,
    blocked: productionReadinessItems.filter((item) => item.status === "blocked").length,
    total: productionReadinessItems.length,
  };
}
