import { settings, type ConfidenceStep } from "./settings";

// What a FIRST attempt at this step would win if right and lose if wrong, at this balance.
// Also used in the browser for the stake line under the slider.
export function getCloutStakes(confidenceStep: ConfidenceStep, clout: number) {
  const { correctGain, wrongLoss, allInMinimumGain } = settings.clout;

  if (confidenceStep === "all_in") {
    return { gainIfCorrect: Math.max(clout, allInMinimumGain), lossIfWrong: clout };
  }
  // A loss larger than the balance leaves zero, so the most you can lose is what you have.
  return {
    gainIfCorrect: correctGain[confidenceStep],
    lossIfWrong: Math.min(wrongLoss[confidenceStep], clout),
  };
}

// The change to the balance (positive or negative) for a first attempt.
export function getCloutChange(confidenceStep: ConfidenceStep, wasCorrect: boolean, clout: number): number {
  const stakes = getCloutStakes(confidenceStep, clout);
  if (wasCorrect) return stakes.gainIfCorrect;
  return stakes.lossIfWrong === 0 ? 0 : -stakes.lossIfWrong;
}
