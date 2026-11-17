"use client";

import { useState } from "react";
import { FeedbackPanel } from "@/components/feedback/FeedbackPanel";
import { Button } from "@/components/ui/Button";
import { SampleLabel } from "./PlaygroundSection";
import { doNothing, sampleRightResult } from "./sampleData";

// The one animated sample: bars fill, the level-up is called out, clout counts
// up. "Replay" remounts the panel (a new key) so it plays again. Still silent.
export function AnimatedFeedbackExample() {
  const [playCount, setPlayCount] = useState(0);

  return (
    <div className="flex flex-col gap-2" data-feedback-sample="animated">
      <div className="flex items-center gap-3">
        <SampleLabel>animated (timings from the theme)</SampleLabel>
        <Button className="text-sm" onClick={() => setPlayCount(playCount + 1)}>
          Replay
        </Button>
      </div>
      <FeedbackPanel
        key={playCount}
        result={sampleRightResult}
        confidenceStep="hunch"
        animate
        onContinue={doNothing}
        isSample
      />
    </div>
  );
}
