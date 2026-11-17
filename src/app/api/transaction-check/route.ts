import { checkTransaction } from "@/server/db/checkTransaction";

// TEMPORARY (checklist item 2): proves the Neon Pool driver can commit and roll back
// on Vercel's runtime. Delete this folder once it has reported success there.

// Run on every request, never at build time, so the build does not need a database.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const outcome = await checkTransaction();
    return Response.json(outcome, { status: outcome.success ? 200 : 500 });
  } catch (error) {
    // Only the message: a full error could include connection details.
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ success: false, message }, { status: 500 });
  }
}
