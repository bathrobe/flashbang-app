import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { isEmailOnList } from "./emailList";

// Who is asking? Used by layouts and by EVERY server action: a layout that
// requires sign-in does not protect the actions called from its pages.

// The session's user, or null when nobody is signed in.
export async function getSignedInUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

type SignedInUser = NonNullable<Awaited<ReturnType<typeof getSignedInUser>>>;

export function isAllowedLearner(user: SignedInUser | null) {
  return isEmailOnList(user, process.env.ALLOWED_EMAILS);
}

export function isAdmin(user: SignedInUser | null) {
  return isAllowedLearner(user) && isEmailOnList(user, process.env.ADMIN_EMAILS);
}

// Returns the user if they are signed in and on ALLOWED_EMAILS.
// Signed out -> the sign-in page. Signed in but not on the list -> "not open yet".
// (redirect() works by throwing, so nothing after it runs.)
export async function requireLearner(): Promise<SignedInUser> {
  const user = await getSignedInUser();
  if (!user) redirect("/");
  if (!isAllowedLearner(user)) redirect("/not-open");
  return user;
}

// Returns the user if they are also on ADMIN_EMAILS.
// A page sends everyone else to /courses; a server action throws instead,
// because an action has no page of its own to send anyone to.
export async function requireAdmin(options: { calledFrom: "page" | "action" }): Promise<SignedInUser> {
  const user = await requireLearner();
  if (isAdmin(user)) return user;
  if (options.calledFrom === "page") redirect("/courses");
  throw new Error("Only an admin can do this.");
}
