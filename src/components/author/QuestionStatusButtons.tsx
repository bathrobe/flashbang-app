"use client";

import { Button } from "@/components/ui/Button";
import { deleteQuestion } from "@/server/actions/author/deleteQuestion";
import { unflagQuestion } from "@/server/actions/author/unflagQuestion";
import type { AuthorQuestion } from "@/server/queries/getAuthorLecture";
import { SaveStatus } from "./SaveStatus";
import { useAuthorAction } from "./useAuthorAction";

// The question's status, with Unflag (when flagged) and Delete.
export function QuestionStatusButtons({ question }: { question: Pick<AuthorQuestion, "id" | "status"> }) {
  const { saveState, runAction, isBusy } = useAuthorAction();
  const questionId = question.id;

  const deleteAfterConfirm = () => {
    if (window.confirm("Delete this question? Answers already given keep their XP.")) {
      runAction(() => deleteQuestion({ questionId }));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p>
        Status: <span className="font-bold">{question.status}</span>
      </p>
      {question.status === "flagged" && (
        <Button onClick={() => runAction(() => unflagQuestion({ questionId }))} disabled={isBusy}>
          Unflag
        </Button>
      )}
      <Button onClick={deleteAfterConfirm} disabled={isBusy}>
        Delete question
      </Button>
      <SaveStatus saveState={saveState} />
    </div>
  );
}
