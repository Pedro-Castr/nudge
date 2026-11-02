import orchestrator from "@tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/cron/tasks", () => {
  describe("Requisição autorizada", () => {
    test("Sem 'authorization header'", async () => {
      const response = await fetch("http://localhost:3000/api/cron/tasks");

      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody).toEqual({
        message: "Não autorizado.",
      });
    });

    test("Com 'authorization token' inválido", async () => {
      const response = await fetch("http://localhost:3000/api/cron/tasks", {
        headers: {
          Authorization: "Bearer invalidSecret",
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody).toEqual({
        message: "Não autorizado.",
      });
    });

    test("Com 'authorization token' válido", async () => {
      const response = await fetch("http://localhost:3000/api/cron/tasks", {
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        success: true,
        deletedCount: expect.any(Number),
      });
    });
  });
});
