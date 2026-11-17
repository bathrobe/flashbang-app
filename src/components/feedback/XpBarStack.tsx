"use client";

import { useState } from "react";
import type { AnswerResult } from "@/server/answerTypes";
import { readThemeDurationMs } from "@/lib/readThemeDurationMs";
import { LevelUpCallout } from "./LevelUpCallout";
import { XpBar } from "./XpBar";

type XpBarStackProps = {
  result: AnswerResult;
  animate: boolean; // false: every bar shows its final value at once (reduced motion, item 13)
  onLevelUp: () => void; // called at each level-up as it is shown; the panel plays the sound once
};

// The main atom's bar first, then each linked atom that gained XP, filling
// one after another: a bar starts when the one above it finishes. On a wrong
// answer, or a retry (no linked share), only the main bar shows.
export function XpBarStack({ result, animate, onLevelUp }: XpBarStackProps) {
  const [mainBar, ...linkedBars] = result.xpBars;
  const bars = [mainBar, ...linkedBars.filter((bar) => bar.xpGained > 0)];

  // Read once from the theme so the timers match the theme file.
  const [timing] = useState(() => ({
    fillDurationMs: animate ? readThemeDurationMs("--transition-duration-bar-fill") : 0,
    levelUpPauseMs: animate ? readThemeDurationMs("--transition-duration-slow") : 0,
  }));
  // Which bar is filling now; bars.length means all are done.
  const [playingBarIndex, setPlayingBarIndex] = useState(animate ? 0 : bars.length);
  const allBarsDone = playingBarIndex >= bars.length;

  function finishBar(barIndex: number) {
    const isLastBar = barIndex === bars.length - 1;
    if (isLastBar && result.learnerLevelUp) onLevelUp();
    setPlayingBarIndex(barIndex + 1);
  }

  return (
    <div className="flex flex-col gap-3">
      {bars.map((bar, barIndex) => {
        let stage: "waiting" | "playing" | "done" = "waiting";
        if (barIndex < playingBarIndex) stage = "done";
        if (barIndex === playingBarIndex) stage = "playing";
        return (
          <XpBar
            key={bar.atomId}
            bar={bar}
            stage={stage}
            fillDurationMs={timing.fillDurationMs}
            levelUpPauseMs={timing.levelUpPauseMs}
            onLevelUp={onLevelUp}
            onFinished={() => finishBar(barIndex)}
          />
        );
      })}
      {allBarsDone && result.learnerLevelUp && <LevelUpCallout kind="learner" level={result.learnerLevelUp.levelAfter} />}
    </div>
  );
}
