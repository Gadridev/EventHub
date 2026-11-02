import { Client } from "pg";
import { env } from "./env.js";

const client = new Client({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 5_000,
});

try {
  await client.connect();
  const result = await client.query<{
    database: string;
    user_name: string;
    server_version: string;
  }>(
    "SELECT current_database() AS database, current_user AS user_name, current_setting('server_version') AS server_version",
  );
  const connection = result.rows[0];

  if (!connection) {
    throw new Error("PostgreSQL returned no connection metadata");
  }

  console.log(
    `PostgreSQL connection successful: database=${connection.database}, user=${connection.user_name}, version=${connection.server_version}`,
  );
  console.log("This was a pg connectivity check, not a Prisma model query.");
} finally {
  await client.end().catch(() => undefined);
}
