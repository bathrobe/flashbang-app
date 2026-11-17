import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

// Every address under /api/auth/ (start sign-in, Google's callback, sign-out,
// read the session) is answered by Better Auth. Handing over a function, not
// `auth` itself, keeps `auth` uncreated until the first request arrives.
export const { GET, POST } = toNextJsHandler((request) => auth.handler(request));
