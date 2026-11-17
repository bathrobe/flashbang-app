"use client";

import { useId } from "react";
import { confidenceSteps, type ConfidenceStep } from "@/game/settings";

const labelByStep: Record<ConfidenceStep, string> = {
  guess: "Guess",
  hunch: "Hunch",
  sure: "Sure",
  all_in: "All in",
};

type ConfidenceSliderProps = {
  confidenceStep: ConfidenceStep;
  onChange: (confidenceStep: ConfidenceStep) => void;
  isLocked: boolean;
};

// A real range input, so arrow keys, Home/End and screen readers all work.
// Four positions (0 to 3) for Guess, Hunch, Sure, All in. The card starts it
// at Hunch; it locks once the answer is submitted.
export function ConfidenceSlider({ confidenceStep, onChange, isLocked }: ConfidenceSliderProps) {
  const position = confidenceSteps.indexOf(confidenceStep);
  const sliderId = useId(); // unique, so several sliders can share a page (the theme playground)

  return (
    <div>
      <label htmlFor={sliderId} className="font-bold">
        Confidence: <span className="font-display">{labelByStep[confidenceStep]}</span>
      </label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={confidenceSteps.length - 1}
        step={1}
        value={position}
        disabled={isLocked}
        aria-valuetext={labelByStep[confidenceStep]}
        onChange={(event) => onChange(confidenceSteps[Number(event.target.value)])}
        className="mt-2 block w-full cursor-pointer accent-accent-4 disabled:cursor-default"
      />
      <div aria-hidden className="mt-1 flex justify-between text-sm">
        {confidenceSteps.map((step) => (
          <span key={step} className={step === confidenceStep ? "font-bold text-ink" : "text-ink-muted"}>
            {labelByStep[step]}
          </span>
        ))}
      </div>
    </div>
  );
}
