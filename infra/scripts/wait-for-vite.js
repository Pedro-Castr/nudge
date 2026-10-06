import { execSync, spawn } from "node:child_process";

function runVite() {
  execSync("npm run services:up", { stdio: "inherit" });
  execSync("npm run services:wait:database", { stdio: "inherit" });
  execSync("npm run migrations:up", { stdio: "inherit" });

  const express = spawn("npm", ["run", "services:run:express"], {
    stdio: "inherit",
  });

  const vite = spawn("npx", ["vite", "dev"], {
    stdio: "inherit",
  });

  process.on("SIGINT", () => {
    execSync("npm run services:down", { stdio: "inherit" });

    express.kill("SIGINT");
    vite.kill("SIGINT");

    process.exit();
  });
}

runVite();
