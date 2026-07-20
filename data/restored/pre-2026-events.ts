import { historicalEventSourceRecords } from "./_source-pre-2026-events";
import { quarantineRecoveredRecord } from "./quarantine";
import type { RecoveryProvenance } from "./types";

export const PRE_2026_EVENTS_PROVENANCE: RecoveryProvenance = {
  snapshotCommit: "6b866c24ad6adcfb580357e9e4a04cc25f505bea",
  removalCommit: "02e1edc9e30dabeddf4c83acc7884623fdd29c6a",
  sourcePath: "data/events.ts",
  sourceBlobSha: "34bff8c9885496890aa2c69180bdc72dacacbcee",
};

export const restoredPre2026Events = historicalEventSourceRecords.map((record) =>
  quarantineRecoveredRecord(record, PRE_2026_EVENTS_PROVENANCE),
);
