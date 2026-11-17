"use client";

import { useState } from "react";
import { useHud } from "@/components/hud/HudProvider";
import type { AnswerResult } from "@/server/answerTypes";
import { submitAnswer } from "@/server/actions/submitAnswer";
import type { CardAnswer } from "./ReviewCard";

export type Submission =
  | { status: "answering" }
  | { status: "saving"; answer: CardAnswer }
  | { status: "failed"; answer: CardAnswer }
  | { status: "answered"; answer: CardAnswer; result: AnswerResult };

// Sending one card's answer, and where that stands. The HUD (navbar clout,
// level, inbox badge) is updated from each result, no reload needed.
export function useAnswerSubmission(attemptId: string, questionId: string, onNotDue: () => void) {
  const { updateHud } = useHud();
  const [submission, setSubmission] = useState<Submission>({ status: "answering" });

  // No timeout of our own: a database waking up can take several seconds.
  // A resend after a failure uses the SAME attemptId, so it can never count twice.
  async function send(answer: CardAnswer) {
    setSubmission({ status: "saving", answer });
    try {
      const result = await submitAnswer({ attemptId, questionId, ...answer });
      // Already answered in another tab: nothing was saved, so just move on.
      if (result.kind === "not_due") return onNotDue();
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

  return { submission, send };
}
