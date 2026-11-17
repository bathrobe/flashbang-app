import type { ScoreAnswerInput } from "@/game/scoreAnswer";

// A typical correct first attempt at Hunch; each test overrides only what it is about.
export const today = "2026-11-16";

export function makeScoreAnswerInput(overrides: Partial<ScoreAnswerInput> = {}): ScoreAnswerInput {
  return {
    kind: "first",
    wasCorrect: true,
    confidenceStep: "hunch",
    mainAtom: { xp: 24, intervalDays: 2.2, reviewCount: 2 },
    linkedAtoms: [],
    clout: 100,
    learnerTotalXp: 50,
    today,
    ...overrides,
  };
}
