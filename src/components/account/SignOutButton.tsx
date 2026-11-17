"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/authClient";

export function SignOutButton() {
  const router = useRouter();

  async function signOutThenGoToSignIn() {
    await authClient.signOut();
    router.push("/");
    // Throws away pages the browser remembered from while signed in.
    router.refresh();
  }

  return <Button onClick={signOutThenGoToSignIn}>Sign out</Button>;
}
