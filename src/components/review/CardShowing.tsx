"use client";

import { useState } from "react";
import { useHud } from "@/components/hud/HudProvider";
import { DoorUnveilingQueue } from "@/components/course/DoorUnveilingQueue";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { Button } from "@/components/ui/Button";
import type { OpenedDoor } from "@/server/answerTypes";
import type { LoadCardResult, ShowableCard } from "@/server/cardTypes";
import type { FlagQuestionResult } from "@/server/flagQuestion/flagQuestionForLearner";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FlagControl } from "./FlagControl";
import { getGradedOptionLooks } from "./formats/getGradedOptionLooks";
import { ReviewCard } from "./ReviewCard";
import { useAnswerSubmission } from "./useAnswerSubmission";

type CardShowingProps = {
  card: ShowableCard;
  attemptId: string; // one per showing; the session gives this component the same value as its key
  onDone: (frontAtomNeedsRetry: boolean) => void;
  onFlagged: (nextCard: LoadCardResult) => void; // the same atom's next card, or "no_questions"
};

// One showing of one card: answer, save, then the feedback panel and Continue.
// The flag control sits beside Confirm, then beside Continue.
export function CardShowing({ card, attemptId, onDone, onFlagged }: CardShowingProps) {
  const { updateHud } = useHud();
  const prefersReducedMotion = useReducedMotion();
  const { submission, send } = useAnswerSubmission(attemptId, card.questionId, () => onDone(false));
  // Set by Continue on an answer that opened a trial door: the unveiling plays, then the session moves on.
  const [doorsToUnveil, setDoorsToUnveil] = useState<OpenedDoor[] | null>(null);

  // Before answering the flag only removes the question; after, it also undoes
  // this answer (so it sends the attemptId). The HUD shows the undone numbers.
  function makeFlagControl(answeredAttemptId?: string) {
    const handleFlagged = ({ hud, nextCard }: FlagQuestionResult) => {
      updateHud(hud);
      onFlagged(nextCard);
    };
    return <FlagControl questionId={card.questionId} attemptId={answeredAttemptId} onFlagged={handleFlagged} />;
  }

  let afterAnswer = null;
  if (submission.status === "failed") {
    afterAnswer = (
      <div role="alert" className="flex flex-wrap items-center gap-3">
        <p className="font-bold">Couldn&apos;t save. Try again.</p>
        <Button onClick={() => send(submission.answer)}>Try again</Button>
      </div>
    );
  }
  if (submission.status === "answered") {
    const needsRetry = !submission.result.wasCorrect;
    const openedDoors = submission.result.openedDoors ?? [];
    afterAnswer = (
      <>
        <FeedbackPanel
          result={submission.result}
          confidenceStep={submission.answer.confidenceStep}
          animate={!prefersReducedMotion}
          onContinue={() => (openedDoors.length > 0 ? setDoorsToUnveil(openedDoors) : onDone(needsRetry))}
          flagControl={makeFlagControl(attemptId)}
        />
        {doorsToUnveil && <DoorUnveilingQueue doors={doorsToUnveil} onAllClosed={() => onDone(needsRetry)} />}
      </>
    );
  }

  return (
    <ReviewCard
      card={card}
      onConfirm={send}
      isLocked={submission.status !== "answering"}
      isSaving={submission.status === "saving"}
      lookByOptionId={
        submission.status === "answered"
          ? getGradedOptionLooks(card.format, submission.result.chosenOptionIds, submission.result.correctOptionIds)
          : undefined
      }
      afterAnswer={afterAnswer}
      flagControl={makeFlagControl()}
    />
  );
}
