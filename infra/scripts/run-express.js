import { spawn } from "node:child_process";

const server = spawn("npx", ["tsx", `${process.cwd()}/server/server.ts`], {
  stdio: "inherit",
});

process.on("SIGINT", () => {
  server.kill("SIGINT");
  process.exit();
});
