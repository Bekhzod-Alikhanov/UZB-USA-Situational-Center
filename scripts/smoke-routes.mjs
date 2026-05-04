const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const locales = ["en", "ru", "uz-latn"];
const routes = [
  "",
  "trade",
  "visits",
  "prepare",
  "commitments",
  "agreements",
  "map",
  "investments",
  "events",
  "grants",
  "contacts",
  "counterparts",
  "counterparts/c-trump",
  "sectors",
  "compliance",
  "staff",
  "news",
  "assistant",
  "benchmark",
  "admin/login",
];

const failures = [];

async function checkGet(pathname, expected = [200]) {
  const response = await fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
  if (!expected.includes(response.status)) {
    failures.push(`${pathname}: expected ${expected.join("/")} but received ${response.status}`);
  }
}

for (const locale of locales) {
  for (const route of routes) {
    await checkGet(`/${locale}${route ? `/${route}` : ""}`);
  }
  await checkGet(`/${locale}/admin`, [302, 303, 307, 308]);
}

const chatResponse = await fetch(`${baseUrl}/api/chat`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", parts: [{ type: "text", text: "smoke test" }] }] }),
});
if (![200, 400, 503].includes(chatResponse.status)) {
  failures.push(`/api/chat: expected 200/400/503 depending on env/provider state but received ${chatResponse.status}`);
}

const liveHealth = await fetch(`${baseUrl}/api/live-data/health`, { redirect: "manual" });
if (liveHealth.status !== 200) {
  failures.push(`/api/live-data/health: expected 200 but received ${liveHealth.status}`);
}

for (const endpoint of [
  "/api/data/trade/latest",
  "/api/data/macro/latest",
  "/api/data/assistance/latest",
  "/api/data/mobility/latest",
  "/api/data/finance/latest",
]) {
  const response = await fetch(`${baseUrl}${endpoint}`, { redirect: "manual" });
  if (response.status !== 200) {
    failures.push(`${endpoint}: expected 200 but received ${response.status}`);
  }
}

const cronResponse = await fetch(`${baseUrl}/api/cron/ingest`, { redirect: "manual" });
if (cronResponse.status !== 401) {
  failures.push(`/api/cron/ingest: expected 401 without CRON_SECRET authorization but received ${cronResponse.status}`);
}

if (failures.length) {
  console.error(`Route smoke test failed against ${baseUrl}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Route smoke test passed for ${locales.length * (routes.length + 1)} localized route checks plus API health/data/cron checks against ${baseUrl}.`,
);
