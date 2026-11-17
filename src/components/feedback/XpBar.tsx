"use client";

import { useMemo } from "react";
import { getAtomTokenLook, getLevelEdgeAndFill } from "@/components/course/atomTokenLook";
import type { XpBarChange } from "@/server/answerTypes";
import { LevelUpCallout } from "./LevelUpCallout";
import { getFillFraction, planXpBarFill } from "./planXpBarFill";
import { useXpBarPlayback, type XpBarStage } from "./useXpBarPlayback";

const segmentCount = 10;

type XpBarProps = {
  bar: XpBarChange;
  stage: XpBarStage;
  fillDurationMs: number;
  levelUpPauseMs: number;
  onLevelUp: (newLevel: number) => void;
  onFinished: () => void;
};

// One atom's XP bar: shortened sentence, level badge, "XP / next threshold",
// and a segmented bar in the level's look. It fills from the old XP to the
// new; at a threshold it fills to the end, calls out the level-up and
// restarts from empty at the next level.
export function XpBar({ bar, stage, fillDurationMs, levelUpPauseMs, onLevelUp, onFinished }: XpBarProps) {
  const segments = useMemo(() => planXpBarFill(bar.xpBefore, bar.xpAfter), [bar.xpBefore, bar.xpAfter]);
  const { shownSegment, shownXp } = useXpBarPlayback({
    segments,
    stage,
    fillDurationMs,
    levelUpPauseMs,
    onLevelUp,
    onFinished,
  });

  const levelLook = getAtomTokenLook(shownSegment.level);
  const segmentLook = getLevelEdgeAndFill(shownSegment.level);
  const filledSegments = getFillFraction(shownSegment, shownXp) * segmentCount;

  return (
    <div className="flex flex-col gap-1" data-xp-bar={bar.atomId}>
      <div className="flex items-center gap-2">
        <span className={`border-thick px-1 font-number text-sm ${levelLook}`}>Lv {shownSegment.level}</span>
        <span className="min-w-0 flex-1 truncate" title={bar.sentence}>
          {bar.sentence}
        </span>
        <span className="font-number text-sm whitespace-nowrap">
          {shownXp} / {shownSegment.nextLevelXp} XP
        </span>
      </div>

      <div
        role="meter"
        aria-label={`XP toward Level ${shownSegment.level + 1}`}
        aria-valuemin={shownSegment.levelStartXp}
        aria-valuemax={shownSegment.nextLevelXp}
        aria-valuenow={shownXp}
        className="flex gap-1"
      >
        {Array.from({ length: segmentCount }, (_, segmentIndex) => {
          const cellFill = Math.min(1, Math.max(0, filledSegments - segmentIndex));
          return (
            <div key={segmentIndex} className={`h-4 flex-1 border-2 bg-panel ${segmentLook.edge}`}>
              {/* The level's fill colour, as wide as this segment is full */}
              <div className={`h-full ${segmentLook.fill}`} style={{ width: `${cellFill * 100}%` }} />
            </div>
          );
        })}
      </div>

      {shownSegment.level > bar.levelBefore && (
        <LevelUpCallout kind="atom" level={shownSegment.level} sentence={bar.sentence} />
      )}
    </div>
  );
}
