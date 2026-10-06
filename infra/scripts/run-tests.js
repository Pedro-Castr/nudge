import { execSync, spawn } from "node:child_process";

function runTests() {
  execSync("npm run services:up", { stdio: "inherit" });
  execSync("npm run services:wait:database", { stdio: "inherit" });
  execSync("npm run migrations:up", { stdio: "inherit" });

  const express = spawn("npm", ["run", "services:run:express"], {
    stdio: "inherit",
  });

  execSync("npm run services:wait:express", { stdio: "inherit" });

  const vitest = spawn("npx", ["vitest", "run", "--reporter=verbose"], {
    stdio: "inherit",
  });

  vitest.on("exit", (code) => {
    express.kill("SIGINT");
    execSync("npm run services:down", { stdio: "inherit" });

    process.exit(code ?? 1);
  });

  process.on("SIGINT", () => {
    express.kill("SIGINT");
    vitest.kill("SIGINT");
    execSync("npm run services:down", { stdio: "inherit" });

    process.exit();
  });
}

runTests();
