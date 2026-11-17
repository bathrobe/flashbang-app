"use client";

import { AtomToken } from "@/components/course/AtomToken";
import { LevelUpCallout } from "@/components/feedback/LevelUpCallout";
import { getXpThresholdForLevel } from "@/game/levels";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";
import { makeSampleAtom, sampleSentence } from "./sampleData";

// Paper, bronze, silver, gold, prismatic; Level 6 shares the prismatic look.
const sampleLevels = [1, 2, 3, 4, 5, 6];

// Every level look on the atom token (hover one for its popover), then the
// level-up callouts that use the same looks.
export function LevelLooksSection() {
  return (
    <PlaygroundSection title="Level looks" group="levels">
      <SampleLabel>atom tokens, Level 1 to 6</SampleLabel>
      <div className="flex flex-wrap gap-2">
        {sampleLevels.map((level) => (
          <AtomToken key={level} atom={makeSampleAtom(`sample-token-${level}`, getXpThresholdForLevel(level))} />
        ))}
      </div>
      <SampleLabel>level-up callouts</SampleLabel>
      <div className="flex flex-col gap-2" data-playground="level-up">
        {[2, 3, 4, 5].map((level) => (
          <LevelUpCallout key={level} kind="atom" level={level} sentence={sampleSentence} />
        ))}
        <LevelUpCallout kind="learner" level={3} />
      </div>
    </PlaygroundSection>
  );
}
