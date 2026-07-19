import { historicalVisitSourceRecords } from "./_source-pre-2025-visits";
import { quarantineRecoveredRecord } from "./quarantine";
import type { RecoveryProvenance } from "./types";

export const PRE_2025_VISITS_PROVENANCE: RecoveryProvenance = {
  snapshotCommit: "a9e3f890347304eea54ec7b4266bef088be63ad2",
  removalCommit: "6b866c24ad6adcfb580357e9e4a04cc25f505bea",
  sourcePath: "data/visits.ts",
  sourceBlobSha: "b5cc1ae4fe1451822f7578622a3729f24c36b90d",
};

export const restoredPre2025Visits = historicalVisitSourceRecords.map((record) =>
  quarantineRecoveredRecord(record, PRE_2025_VISITS_PROVENANCE),
);
