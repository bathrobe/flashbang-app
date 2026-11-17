"use client";

import { Button } from "@/components/ui/Button";
import { unflagQuestion } from "@/server/actions/author/unflagQuestion";
import { SaveStatus } from "./SaveStatus";
import { useAuthorAction } from "./useAuthorAction";

// Flagged -> active: the question returns to rotation.
export function UnflagButton({ questionId }: { questionId: string }) {
  const { saveState, runAction, isBusy } = useAuthorAction();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={() => runAction(() => unflagQuestion({ questionId }))} disabled={isBusy}>
        Unflag
      </Button>
      <SaveStatus saveState={saveState} />
    </div>
  );
}
