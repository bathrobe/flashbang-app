"use client";

import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { MultiSelectOptions } from "@/components/review/formats/MultiSelectOptions";
import { getGradedOptionLooks } from "@/components/review/formats/getGradedOptionLooks";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";
import { AnimatedFeedbackExample } from "./AnimatedFeedbackExample";
import { doNothing, sampleOptions, sampleRightResult, sampleWrongResult } from "./sampleData";

// The feedback panel right and wrong, still (no animation, no sound). The wrong
// one sits under a graded multi-select so correct, wrong and missed show together.
export function FeedbackSection() {
  const wrongLooks = getGradedOptionLooks(
    "multi_select",
    sampleWrongResult.chosenOptionIds,
    sampleWrongResult.correctOptionIds,
  );

  return (
    <PlaygroundSection title="Feedback panel" group="feedback">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2" data-feedback-sample="right">
          <SampleLabel>right, Hunch, level-ups</SampleLabel>
          <FeedbackPanel result={sampleRightResult} confidenceStep="hunch" animate={false} onContinue={doNothing} isSample />
        </div>
        <div className="flex flex-col gap-2" data-feedback-sample="wrong">
          <SampleLabel>wrong multi-select, Sure: correct, wrong, missed</SampleLabel>
          <MultiSelectOptions
            options={sampleOptions}
            chosenOptionIds={sampleWrongResult.chosenOptionIds}
            onChange={doNothing}
            isLocked
            lookByOptionId={wrongLooks}
          />
          <FeedbackPanel result={sampleWrongResult} confidenceStep="sure" animate={false} onContinue={doNothing} isSample />
        </div>
      </div>
      <AnimatedFeedbackExample />
    </PlaygroundSection>
  );
}
