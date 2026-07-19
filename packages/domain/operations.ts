import type { Classification, LocalizedText, PublicationState, TranslationState } from "./types";

export const HEALTH_STATES = ["on_track", "watch", "at_risk", "blocked", "complete"] as const;
export type HealthState = (typeof HEALTH_STATES)[number];

export type EntityId = string;

export type AccountableOwner = {
  userId: EntityId;
  displayName: string;
  organizationId?: EntityId;
  teamId?: EntityId;
};

export type EvidenceReference = {
  evidenceId: EntityId;
  title: LocalizedText;
  classification: Classification;
  submittedAt: string;
  submittedBy: EntityId;
};

export type ApprovalReference = {
  approvalId: EntityId;
  state: "not_requested" | "pending" | "approved" | "rejected" | "changes_requested";
  requestedAt?: string;
  decidedAt?: string;
  approverId?: EntityId;
};

export type BlockerOrDependency = {
  id: EntityId;
  kind: "blocker" | "dependency";
  title: LocalizedText;
  status: "open" | "mitigated" | "resolved";
  ownerId?: EntityId;
  dueDate?: string;
};

export type EscalationReference = {
  escalationId: EntityId;
  state: "not_required" | "proposed" | "open" | "resolved";
  level?: "team" | "agency" | "executive";
  openedAt?: string;
  ownerId?: EntityId;
};

/** The universal executive summary contract used by every operational record. */
export type OperationalSummary = {
  health: HealthState;
  nextAction: LocalizedText;
  accountableOwner: AccountableOwner;
  dueDate: string;
  evidence: EvidenceReference[];
  blockersAndDependencies: BlockerOrDependency[];
  approval: ApprovalReference;
  escalation: EscalationReference;
};

export type GovernedRecord = {
  id: EntityId;
  version: number;
  classification: Classification;
  publicationState: PublicationState;
  translationState: Record<"en" | "uz-latn", TranslationState>;
  createdAt: string;
  updatedAt: string;
};

export type VisitRecord = GovernedRecord & {
  kind: "visit";
  title: LocalizedText;
  startDate: string;
  endDate: string;
  meetingIds: EntityId[];
  summary: OperationalSummary;
};

export type MeetingRecord = GovernedRecord & {
  kind: "meeting";
  visitId: EntityId;
  title: LocalizedText;
  scheduledAt: string;
  attendeeRoleIds: EntityId[];
  agreementIds: EntityId[];
  projectIds: EntityId[];
};

export type AgreementRecord = GovernedRecord & {
  kind: "agreement";
  title: LocalizedText;
  meetingIds: EntityId[];
  commitmentIds: EntityId[];
};

export type ProjectRecord = GovernedRecord & {
  kind: "project";
  title: LocalizedText;
  domain: "trade" | "investment" | "grant" | "regional_programme";
  meetingIds: EntityId[];
  commitmentIds: EntityId[];
};

export type CommitmentRecord = GovernedRecord & {
  kind: "commitment";
  title: LocalizedText;
  agreementId?: EntityId;
  projectId?: EntityId;
  roadmapStepIds: EntityId[];
  actionIds: EntityId[];
  outcomeIds: EntityId[];
  summary: OperationalSummary;
};

export type RoadmapStepRecord = GovernedRecord & {
  kind: "roadmap_step";
  commitmentId: EntityId;
  title: LocalizedText;
  sequence: number;
  actionIds: EntityId[];
  summary: OperationalSummary;
};

export type ActionRecord = GovernedRecord & {
  kind: "action";
  commitmentId: EntityId;
  roadmapStepId?: EntityId;
  title: LocalizedText;
  status: "not_started" | "in_progress" | "blocked" | "submitted" | "approved" | "complete";
  summary: OperationalSummary;
};

export type OutcomeRecord = GovernedRecord & {
  kind: "outcome";
  commitmentId: EntityId;
  title: LocalizedText;
  achievedAt?: string;
  evidenceIds: EntityId[];
};

/**
 * Typed relationship spine. Domain records remain independently modeled and
 * may add their own rich fields without storing arbitrary attribute/value rows.
 */
export type OperationalSpine = {
  visit: VisitRecord;
  meetings: MeetingRecord[];
  agreements: AgreementRecord[];
  projects: ProjectRecord[];
  commitments: CommitmentRecord[];
  roadmapSteps: RoadmapStepRecord[];
  actions: ActionRecord[];
  outcomes: OutcomeRecord[];
};
