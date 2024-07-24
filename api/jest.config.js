/* eslint-disable */

module.exports = {
  preset: "@shelf/jest-mongodb",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*-protocols.ts",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/main/server.ts",
    "<rootDir>/src/presentation/protocols/index.ts",
  ],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
