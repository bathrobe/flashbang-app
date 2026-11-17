"use client";

import { atomTokenSquare, getAtomTokenLook } from "@/components/course/atomTokenLook";
import type { AtomGain } from "@/game/summarizeToday";
import { useCountUp } from "@/lib/useCountUp";

type SpoilRowProps = {
  gain: AtomGain;
  state: "waiting" | "counting" | "done";
  countMs: number;
};

// One atom on the end screen: its level token, its sentence, and the XP it
// gained today. "waiting" shows 0, "counting" runs up to the amount, "done"
// shows the amount.
export function SpoilRow({ gain, state, countMs }: SpoilRowProps) {
  const shownXp = useCountUp(0, state === "waiting" ? 0 : gain.xpGained, state === "counting" ? countMs : 0);

  return (
    <li className="flex items-center gap-3" data-spoil={gain.atomId}>
      <span className={`${atomTokenSquare} shrink-0 font-number text-sm ${getAtomTokenLook(gain.levelNow)}`}>
        {gain.levelNow}
      </span>
      <span className="min-w-0 flex-1">{gain.sentence}</span>
      {/* The counter is for the eyes; screen readers (and the server's HTML) get the final amount */}
      <span className="font-number whitespace-nowrap text-xp" aria-hidden="true">
        +{shownXp} XP
      </span>
      <span className="sr-only" data-xp-gained={gain.xpGained}>
        +{gain.xpGained} XP
      </span>
    </li>
  );
}
