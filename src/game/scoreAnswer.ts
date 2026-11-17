import { settings, type ConfidenceStep } from "./settings";
import { getLevelFromXp, getLearnerLevel } from "./levels";
import { getNextIntervalDays, getDueDate } from "./nextInterval";
import { getCloutChange } from "./clout";

export type ScoreAnswerInput = {
  kind: "first" | "retry";
  wasCorrect: boolean;
  confidenceStep: ConfidenceStep;
  mainAtom: { xp: number; intervalDays: number; reviewCount: number };
  linkedAtoms: { atomId: string; xp: number; weight: number }[];
  clout: number;
  learnerTotalXp: number; // all of the learner's atom XP, needed to spot a learner level-up
  today: string; // the learner's date, "YYYY-MM-DD"
};

// Before, after and amount gained for one XP total, with the levels on each side.
function describeXpChange(xpBefore: number, xpGained: number) {
  const xpAfter = xpBefore + xpGained;
  const levelBefore = getLevelFromXp(xpBefore);
  const levelAfter = getLevelFromXp(xpAfter);
  return { xpBefore, xpAfter, xpGained, levelBefore, levelAfter, leveledUp: levelAfter > levelBefore };
}

function getMainXpGained(input: ScoreAnswerInput): number {
  if (!input.wasCorrect) return 0;
  if (input.kind === "retry") return settings.xp.correctRetry;
  return settings.xp.correctFirstAttemptBase + settings.xp.confidenceBonus[input.confidenceStep];
}

// Works out everything one answer changes. It reads nothing and saves nothing.
export function scoreAnswer(input: ScoreAnswerInput) {
  const isFirstAttempt = input.kind === "first";
  const mainXpGained = getMainXpGained(input);

  // Linked atoms share only in a correct first attempt.
  const linkedAtoms = input.linkedAtoms.map((linkedAtom) => {
    const earnsShare = isFirstAttempt && input.wasCorrect;
    const share = Math.max(settings.xp.minimumLinkedXp, Math.round(mainXpGained * linkedAtom.weight));
    return { atomId: linkedAtom.atomId, ...describeXpChange(linkedAtom.xp, earnsShare ? share : 0) };
  });

  // Only a first attempt moves the interval, due date and review count. null = leave them alone.
  let schedule = null;
  if (isFirstAttempt) {
    const intervalDays = getNextIntervalDays({
      wasCorrect: input.wasCorrect,
      confidenceStep: input.confidenceStep,
      intervalDays: input.mainAtom.intervalDays,
      reviewCount: input.mainAtom.reviewCount,
    });
    schedule = {
      intervalDays,
      dueOn: getDueDate(input.today, intervalDays),
      reviewCount: input.mainAtom.reviewCount + 1,
    };
  }

  // Retries never change clout.
  const cloutChange = isFirstAttempt ? getCloutChange(input.confidenceStep, input.wasCorrect, input.clout) : 0;

  const totalXpGained = mainXpGained + linkedAtoms.reduce((sum, linkedAtom) => sum + linkedAtom.xpGained, 0);
  const totalXpAfter = input.learnerTotalXp + totalXpGained;
  const learnerLevelBefore = getLearnerLevel(input.learnerTotalXp);
  const learnerLevelAfter = getLearnerLevel(totalXpAfter);

  return {
    mainAtom: describeXpChange(input.mainAtom.xp, mainXpGained),
    linkedAtoms,
    schedule,
    clout: { before: input.clout, after: input.clout + cloutChange, change: cloutChange },
    learner: {
      totalXpBefore: input.learnerTotalXp,
      totalXpAfter,
      levelBefore: learnerLevelBefore,
      levelAfter: learnerLevelAfter,
      leveledUp: learnerLevelAfter > learnerLevelBefore,
    },
  };
}
