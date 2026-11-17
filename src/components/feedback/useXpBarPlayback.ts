"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { useCountUp } from "@/lib/useCountUp";
import type { XpBarSegment } from "./planXpBarFill";

// waiting: shows the XP before the answer. playing: fills now. done: shows the result.
export type XpBarStage = "waiting" | "playing" | "done";

type PlaybackOptions = {
  segments: XpBarSegment[]; // from planXpBarFill
  stage: XpBarStage;
  fillDurationMs: number; // per segment
  levelUpPauseMs: number; // a beat on the full bar so the level-up can be seen
  onLevelUp: (newLevel: number) => void;
  onFinished: () => void;
};

// Plays an XP bar's plan one segment after another while `stage` is "playing".
// Returns the segment to draw and the XP number to show right now.
export function useXpBarPlayback({ segments, stage, fillDurationMs, levelUpPauseMs, onLevelUp, onFinished }: PlaybackOptions) {
  const [playingIndex, setPlayingIndex] = useState(0);
  const lastIndex = segments.length - 1;

  // Effect events see the latest props without restarting the timer below.
  const reachSegmentEnd = useEffectEvent(() => {
    const segment = segments[playingIndex];
    if (playingIndex === lastIndex) return onFinished();
    onLevelUp(segment.level + 1);
    setPlayingIndex(playingIndex + 1);
  });

  useEffect(() => {
    if (stage !== "playing") return;
    const pauseMs = segments[playingIndex].endsInLevelUp ? levelUpPauseMs : 0;
    const timerId = setTimeout(reachSegmentEnd, fillDurationMs + pauseMs);
    return () => clearTimeout(timerId);
  }, [stage, playingIndex, segments, fillDurationMs, levelUpPauseMs]);

  let shownIndex = playingIndex;
  if (stage === "waiting") shownIndex = 0;
  if (stage === "done") shownIndex = lastIndex;
  const shownSegment = segments[shownIndex];

  const countedXp = useCountUp(shownSegment.fromXp, shownSegment.toXp, stage === "playing" ? fillDurationMs : 0);
  let shownXp = countedXp;
  if (stage === "waiting") shownXp = shownSegment.fromXp;

  return { shownSegment, shownXp };
}
