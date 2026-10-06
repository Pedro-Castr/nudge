import { execSync, spawn } from "node:child_process";

function runVite() {
  execSync("npm run services:up", { stdio: "inherit" });
  execSync("npm run services:wait:database", { stdio: "inherit" });
  execSync("npm run migrations:up", { stdio: "inherit" });

  const express = spawn("npm", ["run", "services:run:express"], {
    stdio: "inherit",
    detached: true,
  });

  const vite = spawn("npx", ["vite", "dev"], {
    stdio: "inherit",
    detached: true,
  });

  let encerrando = false;

  function encerrar() {
    if (encerrando) return;
    encerrando = true;

    for (const proc of [express, vite]) {
      try {
        process.kill(-proc.pid, "SIGTERM");
      } catch {}
    }

    try {
      execSync("npm run services:down", { stdio: "inherit" });
    } catch {}

    process.exit();
  }

  process.on("SIGINT", encerrar);
  process.on("SIGTERM", encerrar);
  process.on("SIGHUP", encerrar);

  express.on("exit", (code) => {
    if (!encerrando && code !== 0) encerrar();
  });
}

runVite();
