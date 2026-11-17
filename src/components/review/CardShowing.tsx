"use client";

import { useState } from "react";
import { useHud } from "@/components/hud/HudProvider";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { Button } from "@/components/ui/Button";
import type { AnswerResult } from "@/server/answerTypes";
import type { ShowableCard } from "@/server/cardTypes";
import { submitAnswer } from "@/server/actions/submitAnswer";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { getGradedOptionLooks } from "./formats/getGradedOptionLooks";
import { ReviewCard, type CardAnswer } from "./ReviewCard";

type Submission =
  | { status: "answering" }
  | { status: "saving"; answer: CardAnswer }
  | { status: "failed"; answer: CardAnswer }
  | { status: "answered"; answer: CardAnswer; result: AnswerResult };

type CardShowingProps = {
  card: ShowableCard;
  attemptId: string; // one per showing; the session gives this component the same value as its key
  onDone: (frontAtomNeedsRetry: boolean) => void;
};

// One showing of one card: answer, save, then the feedback panel and Continue.
// The HUD (navbar clout, level, inbox badge) is updated from each result, no reload needed.
export function CardShowing({ card, attemptId, onDone }: CardShowingProps) {
  const { updateHud } = useHud();
  const prefersReducedMotion = useReducedMotion();
  const [submission, setSubmission] = useState<Submission>({ status: "answering" });

  // No timeout of our own: a database waking up can take several seconds.
  // A resend after a failure uses the SAME attemptId, so it can never count twice.
  async function send(answer: CardAnswer) {
    setSubmission({ status: "saving", answer });
    try {
      const result = await submitAnswer({ attemptId, questionId: card.questionId, ...answer });
      // Already answered in another tab: nothing was saved, so just move on.
      if (result.kind === "not_due") return onDone(false);
      updateHud({
        clout: result.cloutAfter,
        learnerLevel: result.learnerLevel,
        totalXp: result.learnerTotalXp,
        dueCount: result.dueCount,
      });
      setSubmission({ status: "answered", answer, result });
    } catch {
      setSubmission({ status: "failed", answer });
    }
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
    afterAnswer = (
      <FeedbackPanel
        result={submission.result}
        confidenceStep={submission.answer.confidenceStep}
        animate={!prefersReducedMotion}
        onContinue={() => onDone(!submission.result.wasCorrect)}
      />
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
    />
  );
}
