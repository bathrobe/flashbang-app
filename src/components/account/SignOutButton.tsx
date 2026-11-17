"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

export function SignOutButton() {
  const router = useRouter();

  async function signOutThenGoToSignIn() {
    await authClient.signOut();
    router.push("/");
    // Throws away pages the browser remembered from while signed in.
    router.refresh();
  }

  return (
    <button type="button" onClick={signOutThenGoToSignIn} className="cursor-pointer border px-4 py-2">
      Sign out
    </button>
  );
}
