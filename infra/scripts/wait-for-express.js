import http from "node:http";

function checkExpress() {
  const request = http.get("http://localhost:3000", (response) => {
    console.log("\n\n🟢 Express está pronto e rodando na porta 3000!\n");
  });

  request.on("error", () => {
    process.stdout.write(".");
    setTimeout(checkExpress, 100);
  });
}

process.stdout.write("\n\n🔴 Aguardando Express iniciar");

checkExpress();
