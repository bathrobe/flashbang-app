"use client";

import { Button } from "@/components/ui/Button";
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
    <Button variant="accent-2" onClick={continueWithGoogle}>
      Continue with Google
    </Button>
  );
}
