"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { getQueueAfterAnswer } from "@/game/sessionQueue";
import type { LoadCardResult } from "@/server/cardTypes";
import { CardShowing } from "./CardShowing";
import { useFrontCard } from "./useFrontCard";

// One review session: the queue of atom ids lives here, in browser memory only.
// Closing the tab loses nothing, because the page rebuilds the queue from the
// database. Later changes to the `atomIds` prop are ignored on purpose.
export function ReviewSession({ atomIds }: { atomIds: string[] }) {
  const router = useRouter();
  const [queue, setQueue] = useState(atomIds);
  const [showingNumber, setShowingNumber] = useState(0);

  // Move past the front atom. A missed one goes back in three places later,
  // so the session can't end while a retry is outstanding.
  function moveOn(frontAtomNeedsRetry: boolean) {
    setQueue((currentQueue) => getQueueAfterAnswer(currentQueue, frontAtomNeedsRetry));
    setShowingNumber((number) => number + 1);
  }

  const { frontCard, replaceFrontCard } = useFrontCard(queue[0], showingNumber, () => moveOn(false));

  // After a flag the server sends the same atom's next card. It replaces the
  // flagged one in place, so the atom keeps its one spot in the queue (a miss
  // is only re-inserted on Continue, which the flagged card never reached).
  // No other question left: skip the atom, with no re-insert.
  function showCardAfterFlag(nextCard: LoadCardResult) {
    if (nextCard.kind === "first" || nextCard.kind === "retry") replaceFrontCard(nextCard);
    else moveOn(false);
  }

  const isFinished = queue.length === 0;
  useEffect(() => {
    if (isFinished) router.replace("/review/done");
  }, [isFinished, router]);

  if (isFinished) return <p aria-live="polite">Session complete.</p>;

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
        <CardShowing
          key={frontCard.attemptId}
          card={frontCard.card}
          attemptId={frontCard.attemptId}
          onDone={moveOn}
          onFlagged={showCardAfterFlag}
        />
      )}
    </div>
  );
}
