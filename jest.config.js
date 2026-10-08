import nextJest from "next/jest.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const createJestConfig = nextJest({
  dir: ".",
});

export default createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
  testEnvironment: "node",
  verbose: true,
  maxWorkers: 1,
});
