// Scripts end with `main().catch(exitWithReadableError)` so a failure prints
// one plain line (for example "DATABASE_URL is not set…") instead of a stack trace.
export function exitWithReadableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`FAILED: ${message}`);
  process.exit(1);
}
