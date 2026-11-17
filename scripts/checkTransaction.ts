import { checkTransaction } from "../src/server/db/checkTransaction";
import { closeDatabaseConnections } from "../src/server/db/client";
import { exitWithReadableError } from "./exitWithReadableError";

// Run with: pnpm exec dotenv -e .env.local -- tsx scripts/checkTransaction.ts
async function main() {
  const outcome = await checkTransaction();
  await closeDatabaseConnections();

  if (!outcome.success) {
    console.error("FAILED: transaction check", outcome);
    process.exit(1);
  }
  console.log("OK: a transaction rolled back, another committed, and the test row is deleted.");
}

main().catch(exitWithReadableError);
