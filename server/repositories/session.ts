import database from "@infra/connection";

async function runInsertQuery(token: string, userId: string, expiresAt: Date) {
  const results = await database.query({
    text: `
        INSERT INTO
          sessions (token, user_id, expires_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
    values: [token, userId, expiresAt],
  });

  return results.rows[0];
}

async function findOneValidByToken(token: string) {
  const results = await database.query({
    text: `
      SELECT
        *
      FROM
        sessions
      WHERE
        token = $1
        AND expires_at > NOW()
      LIMIT
        1
    ;`,
    values: [token],
  });

  return results.rows[0] ?? null;
}

const sessionRepository = {
  runInsertQuery,
  findOneValidByToken,
};

export default sessionRepository;
