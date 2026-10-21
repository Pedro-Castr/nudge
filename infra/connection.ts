import { Client, Pool } from "pg";
import { ServiceError } from "./errors/errors";

type QueryObjectOptions = {
  text: string;
  values?: unknown[];
};

const connectionConfig = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: getSSLValues(),
};

const globalForPg = globalThis as unknown as { pgPool?: Pool };

const pool = (globalForPg.pgPool ??= createPool());

function createPool() {
  const newPool = new Pool({
    ...connectionConfig,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });

  newPool.on("error", (error) => {
    console.error("[db] erro em conexão ociosa do pool:", error.message);
  });

  return newPool;
}

async function query(queryObject: QueryObjectOptions) {
  try {
    return await pool.query(queryObject);
  } catch (error) {
    throw new ServiceError({
      message: "Erro na conexão com Banco ou na Query.",
      cause: error,
    });
  }
}

async function getNewClient() {
  const client = new Client(connectionConfig);

  await client.connect();
  return client;
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

const database = {
  query,
  getNewClient,
};

export default database;
