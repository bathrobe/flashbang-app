import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { database } from "./db/client";
import * as schema from "./db/schema";

// Better Auth handles Google sign-in and the session cookie. It reads
// BETTER_AUTH_SECRET (signs sessions) and BETTER_AUTH_URL (this app's own
// address, used to build the address Google sends people back to) from the
// environment by itself. No email-and-password sign-in: nothing here enables it.
export function createAuth() {
  return betterAuth({
    // The adapter finds the user, session, account and verification tables by
    // name inside `schema` (they are defined in db/schema/auth.ts).
    database: drizzleAdapter(database, { provider: "pg", schema }),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    // A sign-in that fails before Better Auth can read where we asked it to go
    // (for example an expired attempt) also lands on the sign-in page's message.
    onAPIError: { errorURL: "/?signin=failed" },
    // Lets server actions set cookies. Must stay last in the list.
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;

let createdAuth: Auth | undefined;

// `auth` looks and behaves like Better Auth's object, but it is only created
// the first time it is used (the same trick as `database` in db/client.ts).
// Better Auth refuses to start in production without BETTER_AUTH_SECRET, and
// that must not happen merely because `pnpm build` imported this file.
export const auth = new Proxy({} as Auth, {
  get(_placeholder, propertyName) {
    createdAuth ??= createAuth();
    return Reflect.get(createdAuth, propertyName);
  },
});
