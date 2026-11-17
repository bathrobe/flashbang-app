"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthorActionResult } from "@/server/actions/author/authorInputShapes";

export type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "failed"; reasons: string[] };

// Runs one author action and remembers how it went, for SaveStatus. On success
// the page re-reads its data from the server (router.refresh), so counts,
// warnings and the other questions' "introductory" boxes catch up. On failure
// nothing is reset: whatever the admin typed stays in the fields.
export function useAuthorAction() {
  const router = useRouter();
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });

  async function runAction(performAction: () => Promise<AuthorActionResult>) {
    setSaveState({ kind: "saving" });
    try {
      const result = await performAction();
      if (!result.ok) {
        setSaveState({ kind: "failed", reasons: result.errors });
        return;
      }
      setSaveState({ kind: "saved" });
      router.refresh();
    } catch (error) {
      const reason = error instanceof Error ? error.message : "The server could not be reached";
      setSaveState({ kind: "failed", reasons: [reason] });
    }
  }

  return { saveState, runAction, isBusy: saveState.kind === "saving" };
}
