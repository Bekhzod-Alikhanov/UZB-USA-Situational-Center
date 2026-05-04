const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const url = `${baseUrl}/api/live-data/health?probe=1`;

let response;
try {
  response = await fetch(url);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Live-data probe could not reach ${url}. Start the app first with "pnpm dev" or "pnpm start".`);
  console.error(message);
  process.exit(1);
}
if (!response.ok) {
  console.error(`Live-data probe failed with HTTP ${response.status}: ${url}`);
  process.exit(1);
}

const payload = await response.json();
const probes = Array.isArray(payload.probes) ? payload.probes : [];
const failed = probes.filter((probe) => probe.status !== "not-probed" && probe.status !== "not-configured" && !probe.ok);

for (const probe of probes) {
  console.log(`${probe.ok ? "OK" : "WARN"} ${probe.id}: ${probe.message}`);
}

if (failed.length) {
  console.error(`\n${failed.length} live-data connector probe(s) failed.`);
  process.exit(1);
}
