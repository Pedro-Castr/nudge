import orchestrator from "../../orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
});

describe("POST api/migrations", () => {
  describe("Usuário anônimo", () => {
    test("Pela primeira vez", async () => {
      const response = await fetch("http://localhost:3000/api/migrations", {
        method: "POST",
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });

    test("Pela segunda vez", async () => {
      const response = await fetch("http://localhost:3000/api/migrations", {
        method: "POST",
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(0);
    });
  });
});
