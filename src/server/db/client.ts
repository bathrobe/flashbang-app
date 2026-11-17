import { Pool } from "@neondatabase/serverless";
import { drizzle, NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// Drizzle over the Neon driver's Pool (WebSockets), because submitAnswer and
// flagQuestion need real transactions, which Neon's HTTP mode does not provide.
// Node 22+ has a built-in WebSocket, so the driver needs no extra setup.

type Database = NeonDatabase<typeof schema> & { $client: Pool };

let connectedDatabase: Database | undefined;

function connectOnFirstUse(): Database {
  if (connectedDatabase) return connectedDatabase;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Put the Neon connection string in .env.local " +
        "(dev branch) or .env.production.local (production).",
    );
  }

  const pool = new Pool({ connectionString });
  connectedDatabase = drizzle(pool, { schema });
  return connectedDatabase;
}

// `database` looks and behaves like the Drizzle database, but nothing connects
// (or complains about a missing DATABASE_URL) until the first time it is used.
// That keeps `pnpm build` working on a machine with no database address.
// The stand-in is an empty object of the right kind, so Drizzle's own
// "is this a database?" checks pass before anything has connected.
const standIn = Object.create(NeonDatabase.prototype) as Database;

export const database = new Proxy(standIn, {
  get(_placeholder, propertyName) {
    const realDatabase = connectOnFirstUse();
    const value = Reflect.get(realDatabase, propertyName);
    return typeof value === "function" ? value.bind(realDatabase) : value;
  },
});

// Scripts call this when they finish; open connections would keep them running.
export async function closeDatabaseConnections() {
  if (!connectedDatabase) return;
  await connectedDatabase.$client.end();
  connectedDatabase = undefined;
}
