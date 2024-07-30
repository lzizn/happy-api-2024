/* eslint-disable */

/** @type {import('jest').Config} */
module.exports = {
  preset: "@shelf/jest-mongodb",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/**/*.d.ts",
  ],
  coveragePathIgnorePatterns: ["<rootDir>/src/main/server.ts"],
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
