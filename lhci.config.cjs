module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/en",
        "http://localhost:3000/en/trade",
        "http://localhost:3000/en/benchmark",
        "http://localhost:3000/en/assistant",
      ],
      startServerCommand: "pnpm exec next start -p 3000",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 120000,
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
