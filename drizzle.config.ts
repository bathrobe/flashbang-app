import { defineConfig } from "drizzle-kit";

// `pnpm db:generate` compares the table definitions with drizzle/ and writes a
// migration (no database needed). `pnpm db:migrate` applies migrations; the
// package script loads DATABASE_URL from the right .env file first.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
