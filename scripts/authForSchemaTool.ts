import { createAuth } from "../src/server/auth";

// Only for Better Auth's command-line tool, which needs a ready-made `auth` to
// read. The app itself uses the lazily created one in src/server/auth.ts.
// The command is in src/server/db/schema/index.ts.
export const auth = createAuth();
