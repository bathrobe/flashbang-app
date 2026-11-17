"use client";

import { OptionButton, type OptionLook } from "@/components/review/formats/OptionButton";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";
import { doNothing, sampleOptions } from "./sampleData";

const optionLooks: OptionLook[] = ["resting", "hovered", "chosen", "correct", "wrong", "missed"];

// The answer option in each of its six states. "hovered" is forced here so it
// can be seen without a pointer; the resting one also really hovers.
export function OptionStatesSection() {
  return (
    <PlaygroundSection title="Option buttons" group="options">
      <div className="grid gap-3 sm:grid-cols-2">
        {optionLooks.map((look) => {
          const isGraded = look === "correct" || look === "wrong" || look === "missed";
          return (
            <div key={look} data-option-look={look}>
              <SampleLabel>{look}</SampleLabel>
              <OptionButton
                text={sampleOptions[0].text}
                look={look}
                isChosen={look === "chosen"}
                selectionRole="radio"
                isLocked={isGraded}
                onClick={doNothing}
              />
            </div>
          );
        })}
      </div>
    </PlaygroundSection>
  );
}
