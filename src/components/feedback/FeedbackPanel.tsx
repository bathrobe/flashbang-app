"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { ConfidenceStep } from "@/game/settings";
import { playSound } from "@/lib/sound";
import { chooseAnswerSound } from "./chooseAnswerSound";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import type { AnswerResult } from "@/server/answerTypes";
import { CloutChange } from "./CloutChange";
import { XpBarStack } from "./XpBarStack";

type FeedbackPanelProps = {
  result: AnswerResult;
  confidenceStep: ConfidenceStep; // the step the answer was confirmed at (to spot an All in wipe)
  animate?: boolean; // false under reduced motion: bars and counters jump to the end
  onContinue: () => void;
  flagControl?: ReactNode; // beside Continue: flagging here also undoes this answer
  isSample?: boolean; // the theme playground: many panels at once, so no sounds and no grabbing focus
};

// Shown in place of the Confirm area once submitAnswer returns. The card's
// options above it are already re-coloured correct, wrong and missed.
// Nothing advances on its own: only Continue moves to the next card.
export function FeedbackPanel({
  result,
  confidenceStep,
  animate = true,
  onContinue,
  flagControl,
  isSample = false,
}: FeedbackPanelProps) {
  const isAllInWipe = !result.wasCorrect && result.kind === "first" && confidenceStep === "all_in" && result.cloutBefore > 0;

  // Sounds only add to what is on screen: every event here is also shown, so
  // with sound off nothing is lost.
  const hasLevelUp = result.atomLevelUps.length > 0 || result.learnerLevelUp !== null;
  const answerSoundPlayed = useRef(false);
  useEffect(() => {
    // The ref stops a second play when React runs effects twice in development.
    if (answerSoundPlayed.current || isSample) return;
    answerSoundPlayed.current = true;
    playSound(chooseAnswerSound({ wasCorrect: result.wasCorrect, isAllInWipe, hasLevelUp, animate }));
  }, [result.wasCorrect, isAllInWipe, hasLevelUp, animate, isSample]);

  // Level-ups: the bars report each one as it is shown; the jingle plays once
  // per answer, at the first one. (Without animation it played above instead.)
  const levelUpSoundPlayed = useRef(false);
  function handleLevelUp() {
    if (levelUpSoundPlayed.current || isSample) return;
    levelUpSoundPlayed.current = true;
    playSound("level-up");
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
        <Button variant="accent-1" onClick={onContinue} autoFocus={!isSample}>
          Continue
        </Button>
        {flagControl}
      </div>
    </Panel>
  );
}
