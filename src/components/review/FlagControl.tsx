"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getButtonLook } from "@/components/ui/buttonLook";
import { Popover } from "@/components/ui/Popover";
import { flagQuestion } from "@/server/actions/flagQuestion";
import type { FlagQuestionResult } from "@/server/flagQuestion/flagQuestionForLearner";
import { flagNoteMaxLength } from "@/server/flagQuestion/flagQuestionInput";

type FlagControlProps = {
  questionId: string;
  attemptId?: string; // only on the feedback panel: the answer the flag undoes
  onFlagged: (result: FlagQuestionResult) => void;
};

// "Flag" opens a small box: an optional note saying what was wrong, and Flag.
// The question leaves rotation at once; an answer to it is undone.
export function FlagControl({ questionId, attemptId, onFlagged }: FlagControlProps) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");

  async function sendFlag() {
    setStatus("sending");
    try {
      onFlagged(await flagQuestion({ questionId, note, attemptId }));
    } catch {
      setStatus("failed");
    }
  }

  return (
    <Popover
      trigger="Flag"
      triggerLabel="Flag this question"
      triggerClassName={getButtonLook("plain", "text-sm")}
      panelWidthClassName="w-72 max-w-[80vw]"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={`flag-note-${questionId}`} className="font-bold">
          What&apos;s wrong with this question? <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id={`flag-note-${questionId}`}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={flagNoteMaxLength}
          rows={3}
          disabled={status === "sending"}
          className="border-thick border-outline bg-panel p-2 text-ink"
        />
        {status === "failed" && (
          <p role="alert" className="font-bold">
            Couldn&apos;t flag it. Try again.
          </p>
        )}
        <Button variant="accent-1" onClick={sendFlag} disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Flagging…" : "Flag"}
        </Button>
      </div>
    </Popover>
  );
}
