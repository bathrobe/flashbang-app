"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getButtonLook } from "@/components/ui/buttonLook";
import { Panel } from "@/components/ui/Panel";
import { ReviewCard, type CardAnswer } from "./ReviewCard";
import { useFrontCard } from "./useFrontCard";

// One review session: the queue of atom ids lives here, in browser memory only.
// Closing the tab loses nothing, because the page rebuilds the queue from the
// database. Later changes to the `atomIds` prop are ignored on purpose.
export function ReviewSession({ atomIds }: { atomIds: string[] }) {
  const [queue, setQueue] = useState(atomIds);
  const [showingNumber, setShowingNumber] = useState(0);

  function skipFrontAtom() {
    setQueue((currentQueue) => currentQueue.slice(1));
    setShowingNumber((number) => number + 1);
  }

  const frontCard = useFrontCard(queue[0], showingNumber, skipFrontAtom);

  // HAND-OFF (checklist item 11): send the answer with submitAnswer({ attemptId,
  // questionId, ...answer }), lock the card, show feedback, and on Continue move
  // on: re-insert a missed atom three places later, then go to /review/done when
  // the queue is empty. For now Confirm does nothing.
  function handleConfirm(answer: CardAnswer) {
    void answer;
  }

  if (queue.length === 0) {
    // Only reached for now when every remaining atom was skipped; item 11 goes to /review/done instead.
    return (
      <Panel>
        <p className="font-display text-xl">Nothing left to review.</p>
        <Link href="/courses" className={getButtonLook("plain", "mt-4")}>
          Back to courses
        </Link>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-ink-muted">
        Cards remaining: <span className="font-number text-ink">{queue.length}</span>
      </p>

      {frontCard.status === "loading" && <p aria-live="polite">Loading the next card…</p>}

      {frontCard.status === "failed" && (
        <Panel role="alert" className="flex flex-wrap items-center gap-3">
          <p className="font-bold">Couldn&apos;t load the next card.</p>
          <Button onClick={() => setShowingNumber((number) => number + 1)}>Try again</Button>
        </Panel>
      )}

      {frontCard.status === "showing" && (
        <ReviewCard key={frontCard.attemptId} card={frontCard.card} onConfirm={handleConfirm} isLocked={false} />
      )}
    </div>
  );
}
