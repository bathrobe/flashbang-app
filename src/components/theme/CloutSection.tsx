"use client";

import { CloutChange } from "@/components/feedback/CloutChange";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";

const cloutSamples = [
  { label: "gain", cloutBefore: 100, cloutAfter: 125, cloutChange: 25, isRetry: false, isAllInWipe: false },
  { label: "loss", cloutBefore: 100, cloutAfter: 95, cloutChange: -5, isRetry: false, isAllInWipe: false },
  { label: "no change (Guess, wrong)", cloutBefore: 100, cloutAfter: 100, cloutChange: 0, isRetry: false, isAllInWipe: false },
  { label: "retry", cloutBefore: 100, cloutAfter: 100, cloutChange: 0, isRetry: true, isAllInWipe: false },
  { label: "All in wipe", cloutBefore: 240, cloutAfter: 0, cloutChange: -240, isRetry: false, isAllInWipe: true },
];

// The clout change in each of its forms, shown at its final number.
export function CloutSection() {
  return (
    <PlaygroundSection title="Clout change" group="clout">
      <div className="flex flex-col gap-3">
        {cloutSamples.map(({ label, ...cloutProps }) => (
          <div key={label}>
            <SampleLabel>{label}</SampleLabel>
            <CloutChange {...cloutProps} animate={false} />
          </div>
        ))}
      </div>
    </PlaygroundSection>
  );
}
