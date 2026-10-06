import { execSync, spawn } from "node:child_process";

function runVite() {
  execSync("npm run services:up", { stdio: "inherit" });
  execSync("npm run services:wait:database", { stdio: "inherit" });
  execSync("npm run migrations:up", { stdio: "inherit" });

  const vite = spawn("npx", ["vite", "dev"], { stdio: "inherit" });

  function encerrar() {
    vite.kill("SIGINT");
    try {
      execSync("npm run services:down", { stdio: "inherit" });
    } catch {}
    process.exit();
  }

  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(signal, encerrar);
  }
}

runVite();
