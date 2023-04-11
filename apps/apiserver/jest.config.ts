import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  coverageProvider: "v8",
  coverageDirectory: "coverage",
  // required only for integration tests
  maxConcurrency: 1,
  projects: [
    {
      displayName: "unit",
      preset: "jest-presets/jest/node",
      testMatch: [
        "<rootDir>/test/unit/**/*.test.ts",
        "<rootDir>/test/unit/**/*.test.tsx",
      ],
      watchPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/coverage/",
      ],
    },
    {
      displayName: "integration",
      preset: "jest-presets/jest/node",
      testMatch: [
        "<rootDir>/test/integration/**/*.test.ts",
        "<rootDir>/test/integration/**/*.test.tsx",
      ],
      watchPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/coverage/",
      ],
    },
  ],
};

export default config;
