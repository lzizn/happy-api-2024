/* eslint-disable */

module.exports = {
  preset: "@shelf/jest-mongodb",
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/index.ts"],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/main/server.ts",
    "<rootDir>/src/presentation/protocols/index.ts",
  ],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@/tests/(.*)": "<rootDir>/tests/$1",
  },
};
