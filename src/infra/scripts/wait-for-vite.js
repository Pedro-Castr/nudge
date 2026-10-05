import { execSync, spawn } from "node:child_process";

function runVite() {
  execSync("npm run services:up", { stdio: "inherit" });
  execSync("npm run services:wait:database", { stdio: "inherit" });
  execSync("npm run migrations:up", { stdio: "inherit" });

  const next = spawn("npx", ["vite", "dev"], {
    stdio: "inherit",
  });

  process.on("SIGINT", () => {
    execSync("npm run services:down", { stdio: "inherit" });

    next.kill("SIGINT");
    process.exit();
  });
}

runVite();
