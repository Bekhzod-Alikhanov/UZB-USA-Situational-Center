import type { Classification, DataConfidence, LocalizedText, PublicationState, TranslationState } from "./types";
import { hasCompleteLocalizedText } from "./validation";

export const OFFICIAL_HEADLINE_CONFIDENCE: DataConfidence = "verified_official";

export const OFFICIAL_HEADLINE_BLOCKED_CONFIDENCES = [
  "company_confirmed",
  "media_reported",
  "internal_unverified",
  "source_needed",
  "illustrative_demo",
] as const satisfies readonly DataConfidence[];

export type QuoteSafeIssueCode =
  | "NOT_PUBLIC"
  | "NOT_PUBLISHED"
  | "NOT_VERIFIED_OFFICIAL"
  | "MISSING_SOURCE"
  | "MISSING_PERIOD"
  | "MISSING_AS_OF"
  | "MISSING_METHODOLOGY"
  | "MISSING_LOCALIZED_TEXT"
  | "EN_TRANSLATION_NOT_APPROVED"
  | "UZ_TRANSLATION_NOT_APPROVED"
  | "BLOCKING_QUALITY_FLAG";

export type QuoteSafeIssue = {
  code: QuoteSafeIssueCode;
  message: string;
};

export type OfficialHeadlineCandidate = {
  classification: Classification;
  publicationState: PublicationState;
  confidence: DataConfidence;
  sourceIds: readonly string[];
  period: string;
  asOf: string;
  methodology: string;
  label: LocalizedText;
  translationState: Record<"en" | "uz-latn", TranslationState>;
  qualityFlags?: readonly string[];
};

const ISSUE_MESSAGES: Record<QuoteSafeIssueCode, string> = {
  NOT_PUBLIC: "Official public headlines must be classified public.",
  NOT_PUBLISHED: "Official public headlines must belong to an immutable published release.",
  NOT_VERIFIED_OFFICIAL: "Official public headlines require verified_official confidence.",
  MISSING_SOURCE: "At least one approved source is required.",
  MISSING_PERIOD: "A reporting period is required.",
  MISSING_AS_OF: "An as-of date is required.",
  MISSING_METHODOLOGY: "A methodology note is required.",
  MISSING_LOCALIZED_TEXT: "Approved English and Uzbek Latin text is required.",
  EN_TRANSLATION_NOT_APPROVED: "English text must be approved.",
  UZ_TRANSLATION_NOT_APPROVED: "Uzbek Latin text must be approved.",
  BLOCKING_QUALITY_FLAG: "Blocking data-quality flags must be resolved.",
};

function issue(code: QuoteSafeIssueCode): QuoteSafeIssue {
  return { code, message: ISSUE_MESSAGES[code] };
}

function present(value: string): boolean {
  return value.trim().length > 0;
}

/** Returns issues in a fixed order so audit output and tests are deterministic. */
export function evaluateOfficialHeadline(candidate: OfficialHeadlineCandidate): QuoteSafeIssue[] {
  const issues: QuoteSafeIssue[] = [];

  if (candidate.classification !== "public") issues.push(issue("NOT_PUBLIC"));
  if (candidate.publicationState !== "published") issues.push(issue("NOT_PUBLISHED"));
  if (candidate.confidence !== OFFICIAL_HEADLINE_CONFIDENCE) issues.push(issue("NOT_VERIFIED_OFFICIAL"));
  if (!candidate.sourceIds.some(present)) issues.push(issue("MISSING_SOURCE"));
  if (!present(candidate.period)) issues.push(issue("MISSING_PERIOD"));
  if (!present(candidate.asOf)) issues.push(issue("MISSING_AS_OF"));
  if (!present(candidate.methodology)) issues.push(issue("MISSING_METHODOLOGY"));
  if (!hasCompleteLocalizedText(candidate.label)) issues.push(issue("MISSING_LOCALIZED_TEXT"));
  if (candidate.translationState.en !== "approved") issues.push(issue("EN_TRANSLATION_NOT_APPROVED"));
  if (candidate.translationState["uz-latn"] !== "approved") issues.push(issue("UZ_TRANSLATION_NOT_APPROVED"));
  if ((candidate.qualityFlags?.length ?? 0) > 0) issues.push(issue("BLOCKING_QUALITY_FLAG"));

  return issues;
}

export function isQuoteSafeOfficialHeadline(candidate: OfficialHeadlineCandidate): boolean {
  return evaluateOfficialHeadline(candidate).length === 0;
}

export class PublicationPolicyError extends Error {
  readonly issues: QuoteSafeIssue[];

  constructor(issues: QuoteSafeIssue[]) {
    super(`Official headline publication blocked: ${issues.map(({ code }) => code).join(", ")}`);
    this.name = "PublicationPolicyError";
    this.issues = issues;
  }
}

export function assertQuoteSafeOfficialHeadline(
  candidate: OfficialHeadlineCandidate,
): asserts candidate is OfficialHeadlineCandidate {
  const issues = evaluateOfficialHeadline(candidate);
  if (issues.length > 0) throw new PublicationPolicyError(issues);
}
