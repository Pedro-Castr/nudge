import orchestrator from "@tests/orchestrator";
import { Task } from "@/features/task/types/task";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH api/task/order", () => {
  describe("Usuário Autenticado", () => {
    test("Com nova ordem", async () => {
      const user = await orchestrator.createUser({});
      const session = await orchestrator.createSession(user.id);
      const a = await orchestrator.createTask(user.id);
      const b = await orchestrator.createTask(user.id);
      const c = await orchestrator.createTask(user.id);

      const response = await fetch("http://localhost:3000/api/task/order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
        body: JSON.stringify({ ids: [c.id, a.id, b.id] }),
      });

      expect(response.status).toBe(204);

      const listResponse = await fetch("http://localhost:3000/api/task", {
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${session.token}`,
        },
      });
      const tasks: Task[] = await listResponse.json();

      expect(tasks.map((task) => task.id)).toEqual([c.id, a.id, b.id]);
      expect(tasks.map((task) => task.posicao)).toEqual([1, 2, 3]);
    });
  });
});
