"use client";

import { confidenceSteps } from "@/game/settings";
import { ConfidenceSlider } from "@/components/review/ConfidenceSlider";
import { StakeLine } from "@/components/review/StakeLine";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";
import { doNothing } from "./sampleData";
import { SampleHud } from "./SampleHud";

// The confidence slider at each of its four steps, with the stake line at a
// sample clout of 100, plus the retry wording.
export function ConfidenceSection() {
  return (
    <PlaygroundSection title="Confidence slider" group="slider">
      <SampleHud sampleValues={{ clout: 100 }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {confidenceSteps.map((step) => (
            <div key={step} data-slider-step={step}>
              <ConfidenceSlider confidenceStep={step} onChange={doNothing} isLocked={false} />
              <StakeLine confidenceStep={step} cardKind="first" />
            </div>
          ))}
          <div>
            <SampleLabel>retry (locked)</SampleLabel>
            <ConfidenceSlider confidenceStep="hunch" onChange={doNothing} isLocked />
            <StakeLine confidenceStep="hunch" cardKind="retry" />
          </div>
        </div>
      </SampleHud>
    </PlaygroundSection>
  );
}
