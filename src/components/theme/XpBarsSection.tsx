"use client";

import { XpBar } from "@/components/feedback/XpBar";
import { PlaygroundSection } from "./PlaygroundSection";
import { doNothing, makeSampleXpBar } from "./sampleData";

// XP values chosen to show empty, part-full and nearly full bars at every level look.
const sampleXpValues = [0, 10, 35, 60, 109, 110, 185];

// The XP bar, finished filling (no animation), at several fills and levels.
export function XpBarsSection() {
  return (
    <PlaygroundSection title="XP bars" group="xp-bars">
      <div className="flex flex-col gap-3">
        {sampleXpValues.map((xp) => (
          <XpBar
            key={xp}
            bar={makeSampleXpBar(`sample-xp-${xp}`, xp)}
            stage="done"
            fillDurationMs={0}
            levelUpPauseMs={0}
            onLevelUp={doNothing}
            onFinished={doNothing}
          />
        ))}
      </div>
    </PlaygroundSection>
  );
}
