// Plain functions for the ALLOWED_EMAILS and ADMIN_EMAILS lists, kept apart
// from access.ts so they can be unit-tested without Next.js or a database.

type EmailAndVerified = { email?: string | null; emailVerified?: boolean | null };

// "A@x.com, b@y.com " -> ["a@x.com", "b@y.com"]
export function parseEmailList(commaSeparatedEmails: string | undefined): string[] {
  return (commaSeparatedEmails ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

// True only when Google has verified the account's email AND it is on the list.
export function isEmailOnList(
  user: EmailAndVerified | null | undefined,
  commaSeparatedEmails: string | undefined,
): boolean {
  if (!user || !user.email || user.emailVerified !== true) return false;
  const email = user.email.trim().toLowerCase();
  return parseEmailList(commaSeparatedEmails).includes(email);
}
