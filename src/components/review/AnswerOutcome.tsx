"use client";

import { Button } from "@/components/ui/Button";
import type { AnswerResult } from "@/server/answerTypes";

// A minimal right-or-wrong line under a graded card, with Continue.
// Checklist item 12 replaces this with the full feedback panel.
export function AnswerOutcome({ result, onContinue }: { result: AnswerResult; onContinue: () => void }) {
  return (
    <div role="status" className="flex flex-col items-start gap-3">
      <p className="font-display text-xl">{result.wasCorrect ? "Correct!" : "Not quite."}</p>
      {!result.wasCorrect && <p>This one will come back later in this session.</p>}
      {/* Nothing advances on its own: only Continue moves to the next card. */}
      <Button variant="accent-1" onClick={onContinue} autoFocus>
        Continue
      </Button>
    </div>
  );
}
