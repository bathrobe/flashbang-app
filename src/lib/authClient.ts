import { createAuthClient } from "better-auth/react";

// The browser's handle on Better Auth. No address is needed because the auth
// routes live on the same site as the pages (/api/auth/...).
export const authClient = createAuthClient();
