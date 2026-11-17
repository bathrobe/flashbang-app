"use client";

import { useState } from "react";
import { readThemeDurationMs } from "@/lib/readThemeDurationMs";
import { useCountUp } from "@/lib/useCountUp";

type CloutChangeProps = {
  cloutBefore: number;
  cloutAfter: number;
  cloutChange: number;
  isRetry: boolean;
  isAllInWipe: boolean; // a wrong All in that took the balance to 0
  animate: boolean; // false: the number jumps straight to the new balance (item 13)
};

// The clout balance counting from old to new, with the amount won or lost.
export function CloutChange({ cloutBefore, cloutAfter, cloutChange, isRetry, isAllInWipe, animate }: CloutChangeProps) {
  const [countDurationMs] = useState(() => (animate ? readThemeDurationMs("--transition-duration-count") : 0));
  const shownClout = useCountUp(cloutBefore, cloutAfter, countDurationMs);

  if (isRetry) return <p className="text-ink-muted">No clout at stake on a retry.</p>;

  let changeText = "no change";
  if (cloutChange > 0) changeText = `+${cloutChange}`;
  if (cloutChange < 0) changeText = `−${Math.abs(cloutChange)}`;

  // The wipe gets a stronger moment: a filled, shaking box (animate-wipe is in theme.css).
  const wipeLook = isAllInWipe ? `bg-wrong text-wrong-ink border-thick border-outline px-2 py-1 ${animate ? "animate-wipe" : ""}` : "";

  return (
    <div className={`flex w-fit flex-wrap items-baseline gap-2 ${wipeLook}`} data-clout-change={cloutChange}>
      {isAllInWipe && <span className="font-display">All in, all gone!</span>}
      <span>Clout</span>
      <span className={`font-number text-xl ${isAllInWipe ? "" : "text-clout"}`}aria-live="off">
        {shownClout}
      </span>
      <span className="font-number">({changeText})</span>
      {/* Screen readers get the end result once, not every step of the count */}
      <span className="sr-only">
        Clout is now {cloutAfter}, {changeText}.
      </span>
    </div>
  );
}
