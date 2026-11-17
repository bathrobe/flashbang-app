"use client";

import { useEffect, useState } from "react";
import type { AtomGain } from "@/game/summarizeToday";
import { readThemeDurationMs } from "@/lib/readThemeDurationMs";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { SpoilRow } from "./SpoilRow";

type SpoilsListProps = { reviewedAtoms: AtomGain[]; linkedOnlyAtoms: AtomGain[] };

// What was collected today: each atom answered, then (separately) each atom
// that only picked up a linked share. The amounts count up one row after
// another; with reduced motion they all show their final value at once.
export function SpoilsList({ reviewedAtoms, linkedOnlyAtoms }: SpoilsListProps) {
  const prefersReducedMotion = useReducedMotion();
  // Read after mounting, because the theme's timing only exists in the browser.
  // Until then (and in the server's HTML) every amount waits at 0.
  const [stepMs, setStepMs] = useState<number | null>(null);
  const [countingIndex, setCountingIndex] = useState(0);
  const rowCount = reviewedAtoms.length + linkedOnlyAtoms.length;

  useEffect(() => {
    // Deliberate: the value only exists in the browser, and setting it after
    // mount keeps the server's HTML and the first browser render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStepMs(readThemeDurationMs("--transition-duration-count"));
  }, []);

  const animate = stepMs !== null && stepMs > 0 && !prefersReducedMotion;
  const allDone = stepMs !== null && !animate;

  // When one row finishes counting, start the next.
  useEffect(() => {
    if (!animate || countingIndex >= rowCount) return;
    const timer = setTimeout(() => setCountingIndex((index) => index + 1), stepMs!);
    return () => clearTimeout(timer);
  }, [animate, countingIndex, rowCount, stepMs]);

  function getRowState(rowIndex: number) {
    if (allDone || rowIndex < countingIndex) return "done";
    if (animate && rowIndex === countingIndex) return "counting";
    return "waiting";
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl">Collected today</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {reviewedAtoms.map((gain, index) => (
            <SpoilRow key={gain.atomId} gain={gain} state={getRowState(index)} countMs={stepMs ?? 0} />
          ))}
        </ul>
      </div>

      {linkedOnlyAtoms.length > 0 && (
        <div>
          <h2 className="font-display text-lg">Shared with linked ideas</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {linkedOnlyAtoms.map((gain, index) => (
              <SpoilRow
                key={gain.atomId}
                gain={gain}
                state={getRowState(reviewedAtoms.length + index)}
                countMs={stepMs ?? 0}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
