import orchestrator from "@tests/orchestrator";
import sessionService from "@server/services/session";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

const EXPIRATION = sessionService.EXPIRATION_IN_MILLISECONDS;
const HOUR = 60 * 60 * 1000;

async function createSessionWithAge(ageInMs: number) {
  const user = await orchestrator.createUser({});
  const session = await orchestrator.createSession(user.id);
  const expiresAt = new Date(Date.now() + EXPIRATION - ageInMs);

  await orchestrator.setSessionExpiresAt(session.token, expiresAt);

  return { token: session.token, expiresAt };
}

function getSession(token?: string) {
  return fetch("http://localhost:3000/api/session", {
    headers: token ? { Cookie: `session_id=${token}` } : {},
  });
}

describe("GET api/session", () => {
  describe("Usuário anônimo", () => {
    test("Sem cookie", async () => {
      const response = await getSession();
      expect(response.status).toBe(401);
    });
  });

  describe("Usuário autenticado", () => {
    test("Com sessão usada há mais de 1 hora", async () => {
      const { token } = await createSessionWithAge(2 * HOUR);

      const response = await getSession(token);
      expect(response.status).toBe(200);

      const session = await sessionService.findOneValidByToken(token);
      const expected = Date.now() + EXPIRATION;

      expect(Math.abs(session.expires_at.getTime() - expected)).toBeLessThan(
        5000,
      );
    });

    test("Com sessão renovada há menos de 1 hora", async () => {
      const { token, expiresAt } = await createSessionWithAge(10 * 60 * 1000);

      const response = await getSession(token);
      expect(response.status).toBe(200);

      const session = await sessionService.findOneValidByToken(token);
      expect(session.expires_at.getTime()).toBe(expiresAt.getTime());
    });

    test("Com sessão vencida", async () => {
      const { token } = await createSessionWithAge(EXPIRATION + HOUR);

      const response = await getSession(token);
      expect(response.status).toBe(401);
    });
  });
});

describe("GET /", () => {
  describe("Usuário anônimo", () => {
    test("Sem cookie", async () => {
      const response = await fetch("http://localhost:3000/");

      expect(response.status).toBe(200);
    });

    test("Com token inexistente", async () => {
      const response = await fetch("http://localhost:3000/", {
        redirect: "manual",
        headers: { Cookie: "session_id=token-inexistente" },
      });

      expect(response.status).toBe(200);
    });
  });

  describe("Usuário autenticado", () => {
    test("Com sessão válida", async () => {
      const user = await orchestrator.createUser({});
      const session = await sessionService.create(user.id);

      const response = await fetch("http://localhost:3000/", {
        redirect: "manual",
        headers: {
          cookie: `session_id=${session.token}`,
        },
      });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toMatch(/\/task$/);
    });
  });
});

describe("GET /auth", () => {
  describe("Usuário anônimo", () => {
    test("Sem cookie", async () => {
      const response = await fetch("http://localhost:3000/auth");
      expect(response.status).toBe(200);
    });

    test("Com token inexistente", async () => {
      const response = await fetch("http://localhost:3000/auth", {
        redirect: "manual",
        headers: { Cookie: "session_id=token-inexistente" },
      });

      expect(response.status).toBe(200);
    });
  });

  describe("Usuário autenticado", () => {
    test("Com sessão válida", async () => {
      const user = await orchestrator.createUser({});
      const session = await sessionService.create(user.id);

      const response = await fetch("http://localhost:3000/auth", {
        redirect: "manual",
        headers: {
          cookie: `session_id=${session.token}`,
        },
      });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toMatch(/\/task$/);
    });
  });
});
