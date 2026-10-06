import { Client } from "pg";
import { ServiceError } from "./errors/errors";

type QueryObjetcOptions = {
  text: string;
  values?: string[];
};

async function query(queryObjetc: QueryObjetcOptions) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObjetc);
    return result;
  } catch (error) {
    const ServiceErrorObject = new ServiceError({
      message: "Erro na conexão com Banco ou na Query.",
      cause: error,
    });
    throw ServiceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

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
