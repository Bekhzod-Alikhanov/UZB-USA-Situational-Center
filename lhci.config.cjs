const baseUrl = process.env.LHCI_BASE_URL ?? "http://127.0.0.1:3000";
const startPort = process.env.LHCI_PORT ?? "3000";
const shouldStartServer = process.env.LHCI_SKIP_START !== "1";

module.exports = {
  ci: {
    collect: {
      url: [`${baseUrl}/en`, `${baseUrl}/en/trade`, `${baseUrl}/en/benchmark`],
      ...(shouldStartServer
        ? {
            startServerCommand: `pnpm start -H 127.0.0.1 -p ${startPort}`,
            startServerReadyPattern: "Ready",
            startServerReadyTimeout: 120000,
          }
        : {}),
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.65 }],
        "categories:accessibility": ["warn", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.85 }],
        "categories:seo": "off",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lhci",
    },
  },
};
