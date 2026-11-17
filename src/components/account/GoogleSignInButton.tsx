"use client";

import { authClient } from "@/lib/authClient";

// Sends the visitor to Google. Google sends them back to /courses, or to the
// sign-in page with its one-line message if they cancel or it fails.
export function GoogleSignInButton() {
  async function continueWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/courses",
      errorCallbackURL: "/?signin=failed",
    });
  }

  return (
    <button type="button" onClick={continueWithGoogle} className="cursor-pointer border px-4 py-2">
      Continue with Google
    </button>
  );
}
