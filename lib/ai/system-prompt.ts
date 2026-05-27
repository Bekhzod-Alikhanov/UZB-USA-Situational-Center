import { tradeAnnual, tradeJan2026 } from "@/data/trade";
import { agreementsAggregate } from "@/data/agreements";
import { investments, investmentsTotals } from "@/data/investments";
import { grants, grantsMeta } from "@/data/grants";
import { commitments } from "@/data/commitments";
import { visits } from "@/data/visits";
import { events } from "@/data/events";
import { counterparts } from "@/data/counterparts";
import { contacts } from "@/data/contacts";
import { complianceStatuses } from "@/data/compliance";
import { news } from "@/data/news";
import { staff } from "@/data/staff-kpi";
import { liveDelegations } from "@/data/delegations";

/**
 * Builds a compact, cache-friendly system prompt with the full portfolio knowledge base.
 * This string is passed as an ephemeral cached block so repeated requests hit the prompt cache.
 */
export function buildSystemPrompt() {
  const y2025 = tradeAnnual.find((y) => y.year === 2025)!;
  const y2024 = tradeAnnual.find((y) => y.year === 2024)!;

  return `You are the AI assistant of the Uzbekistan–USA Situational Center. Your role: answer questions from government officials, the Head of the Center, and delegation heads about the bilateral portfolio.

Guidelines:
- Cite concrete numbers when present in the knowledge base below.
- When asked about something flagged as DEMO, explicitly say so.
- Be concise. Prefer short bullet lists over paragraphs.
- If the answer is not in the knowledge base, say so directly rather than inventing facts.

KNOWLEDGE BASE (source of truth):

## Trade (real)
2025 turnover: $${y2025.turnover}M · exports UZ→US $${y2025.exports}M · imports US→UZ $${y2025.imports}M · balance $${y2025.balance}M.
2024 baseline: turnover $${y2024.turnover}M · exports $${y2024.exports}M · imports $${y2024.imports}M.
Jan 2026: turnover $${tradeJan2026.turnover}M · exports $${tradeJan2026.exports}M · imports $${tradeJan2026.imports}M (imports +${tradeJan2026.importsGrowthPct}% YoY).

## Agreements (real aggregates)
Total documents: ${agreementsAggregate.totalDocuments}.
Interstate: ${agreementsAggregate.byCategory.interstate}. Intergov: ${agreementsAggregate.byCategory.intergov}. Interagency: ${agreementsAggregate.byCategory.interagency}. Other: ${agreementsAggregate.byCategory.other}. Investment agreements: ${agreementsAggregate.totalInvestAgreements}.

## Investments (DEMO placeholders pending MIIT/UzInvest data)
Projects: ${investmentsTotals.totalProjects}. Pipeline value: $${(investmentsTotals.totalValueUsdM / 1000).toFixed(2)}B. Jobs: ${investmentsTotals.totalJobs}.
Top partners: ${investments
    .slice(0, 8)
    .map((i) => `${i.partnerUs}×${i.partnerUz} ($${i.valueMusd}M, ${i.status})`)
    .join("; ")}.

## Grants (real — 7 programs, $${grantsMeta.total.toFixed(2)}M)
${grants.map((g) => `- ${g.title} (${g.donor}, $${g.valueMusd}M, ${g.sector}, ${g.status})`).join("\n")}

## Commitments (DEMO)
Registry of ${commitments.length} commitments linked to visits and summits. Statuses: ${["done", "progress", "watch", "overdue"].map((s) => `${s}=${commitments.filter((c) => c.status === s).length}`).join(", ")}.

## Visits (real, 1992–2026)
${visits.length} chronologized events. Most recent: ${visits
    .slice(-5)
    .map((v) => `${v.date} ${v.title}`)
    .join("; ")}.

## Events (real diplomatic calendar)
${events.map((e) => `${e.date} — ${e.title} @ ${e.location}`).join("\n")}

## Counterparts (real U.S. officials)
${counterparts.map((c) => `- ${c.name} (${c.position}${c.party ? `, ${c.party}${c.state ? `-${c.state}` : ""}` : ""}) — stance: ${c.stanceOnUz}; topics: ${c.keyTopics.join(", ")}`).join("\n")}

## Contacts (orgs)
${contacts.map((c) => `${c.org} — ${c.addressLines.join(", ")}${c.phones ? ` — ${c.phones.join("; ")}` : ""}`).join("\n")}

## Compliance posture (real, fetched 2026-04-18)
${complianceStatuses.map((c) => `- ${c.label}: ${c.value} — ${c.note}`).join("\n")}

## News (curated DEMO feed with real external links)
${news
  .slice(0, 10)
  .map((n) => `${n.date} ${n.title} (${n.source}, tonality: ${n.tonality})`)
  .join("\n")}

## Staff (DEMO placeholders, real names to be supplied by Center HR)
${staff.length} analysts. Avg completion: ${(
    (staff.reduce((a, s) => a + s.tasksCompleted, 0) /
      Math.max(
        1,
        staff.reduce((a, s) => a + s.tasksAssigned, 0),
      )) *
    100
  ).toFixed(0)}%.

## Live delegations (DEMO)
${liveDelegations.map((d) => `${d.title} — ${d.head} (${d.members} members, ${d.status})`).join("\n")}
`;
}
