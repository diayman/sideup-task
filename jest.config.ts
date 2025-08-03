// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // handle CSS imports
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};

export default config;
