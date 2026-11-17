"use client";

import { useRef } from "react";
import type { ConfidenceStep } from "@/game/settings";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import type { AnswerResult } from "@/server/answerTypes";
import { CloutChange } from "./CloutChange";
import { XpBarStack } from "./XpBarStack";

type FeedbackPanelProps = {
  result: AnswerResult;
  confidenceStep: ConfidenceStep; // the step the answer was confirmed at (to spot an All in wipe)
  animate?: boolean; // item 13 passes false under reduced motion: bars and counters jump to the end
  onContinue: () => void;
};

// Shown in place of the Confirm area once submitAnswer returns. The card's
// options above it are already re-coloured correct, wrong and missed.
// Nothing advances on its own: only Continue moves to the next card.
export function FeedbackPanel({ result, confidenceStep, animate = true, onContinue }: FeedbackPanelProps) {
  const isAllInWipe = !result.wasCorrect && result.kind === "first" && confidenceStep === "all_in" && result.cloutBefore > 0;

  // SOUND SLOT (item 13), on first show: playSound(result.wasCorrect ? "correct" : "wrong"),
  // and playSound("all-in-wipe") when isAllInWipe.
  // Level-ups: the bars report each one as it is shown; the sound plays once per answer.
  const levelUpSoundPlayed = useRef(false);
  function handleLevelUp() {
    if (levelUpSoundPlayed.current) return;
    levelUpSoundPlayed.current = true;
    // SOUND SLOT (item 13): playSound("level-up")
  }

  return (
    <Panel className="flex flex-col gap-4" data-feedback={result.wasCorrect ? "correct" : "wrong"}>
      <p
        role="status"
        className={`border-thick border-outline px-3 py-2 font-display text-xl ${
          result.wasCorrect ? "bg-correct text-correct-ink" : "bg-wrong text-wrong-ink"
        }`}
      >
        {result.wasCorrect ? "Correct!" : "Not quite."}
      </p>

      <p data-explanation>{result.explanation}</p>

      <div>
        <p className="font-display text-sm text-ink-muted">The idea</p>
        <p className="font-bold" data-main-atom-sentence>
          {result.mainAtom.sentence}
        </p>
      </div>

      <XpBarStack result={result} animate={animate} onLevelUp={handleLevelUp} />

      <CloutChange
        cloutBefore={result.cloutBefore}
        cloutAfter={result.cloutAfter}
        cloutChange={result.cloutChange}
        isRetry={result.kind === "retry"}
        isAllInWipe={isAllInWipe}
        animate={animate}
      />

      {!result.wasCorrect && <p className="font-bold">This one will come back later in this session.</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="accent-1" onClick={onContinue} autoFocus>
          Continue
        </Button>
        {/* FLAG SLOT (checklist item 16): <FlagControl questionId={result.questionId} /> goes here. */}
      </div>
    </Panel>
  );
}
