"use client";

import { Button } from "@/components/ui/Button";
import { addQuestion } from "@/server/actions/author/addQuestion";
import { deleteAtom } from "@/server/actions/author/deleteAtom";
import { retireAtom } from "@/server/actions/author/retireAtom";
import type { AuthorAtom } from "@/server/queries/getAuthorLecture";
import { SaveStatus } from "./SaveStatus";
import { useAuthorAction } from "./useAuthorAction";

// Add question, Retire atom (always allowed) and Delete atom (only when no
// learner has XP on it; otherwise disabled with the reason).
export function AtomButtons({ atom }: { atom: Pick<AuthorAtom, "id" | "status" | "deleteBlocker"> }) {
  const { saveState, runAction, isBusy } = useAuthorAction();
  const atomId = atom.id;

  const confirmThen = (question: string, performAction: () => ReturnType<typeof retireAtom>) => {
    if (window.confirm(question)) runAction(performAction);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => runAction(() => addQuestion({ atomId }))} disabled={isBusy}>
          Add question
        </Button>
        {atom.status === "active" && (
          <Button
            onClick={() => confirmThen("Retire this atom? It cannot be un-retired.", () => retireAtom({ atomId }))}
            disabled={isBusy}
          >
            Retire atom
          </Button>
        )}
        <Button
          onClick={() => confirmThen("Delete this atom and its questions for good?", () => deleteAtom({ atomId }))}
          disabled={isBusy || atom.deleteBlocker !== null}
          title={atom.deleteBlocker ?? undefined}
        >
          Delete atom
        </Button>
        <SaveStatus saveState={saveState} />
      </div>
      {atom.deleteBlocker && <p className="text-ink-muted">Can&apos;t delete: {atom.deleteBlocker}</p>}
    </div>
  );
}
