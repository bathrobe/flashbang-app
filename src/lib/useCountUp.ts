"use client";

import { useEffect, useState } from "react";
import { getCountUpValue } from "./countUpValue";

// Counts from `from` to `to` over `durationMs`, one animation frame at a time
// (requestAnimationFrame), and starts again whenever the inputs change.
// With a duration of 0 it returns `to` at once: that is how reduced motion
// (checklist item 13) makes counters jump to their final values.
export function useCountUp(from: number, to: number, durationMs: number): number {
  const [shownValue, setShownValue] = useState(from);

  useEffect(() => {
    if (durationMs <= 0) return;
    let frameId = 0;
    let startTime: number | null = null;
    function onFrame(now: number) {
      startTime ??= now;
      const elapsedMs = now - startTime;
      setShownValue(getCountUpValue(from, to, elapsedMs, durationMs));
      if (elapsedMs < durationMs) frameId = requestAnimationFrame(onFrame);
    }
    frameId = requestAnimationFrame(onFrame);
    return () => cancelAnimationFrame(frameId);
  }, [from, to, durationMs]);

  return durationMs <= 0 ? to : shownValue;
}
