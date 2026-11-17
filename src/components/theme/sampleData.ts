// Fixed, made-up data for the theme playground (/theme). Nothing here comes
// from the database, so the page looks the same every time and a palette
// change is the only thing that changes it.

import { getLevelFromXp, getXpThresholdForLevel } from "@/game/levels";
import type { AnswerResult, XpBarChange } from "@/server/answerTypes";
import type { CourseViewAtom } from "@/server/queries/loadStartedLectureAtoms";

export const sampleSentence = "Cleisthenes split Attica into ten tribes so no old family could dominate.";
export const sampleLinkedSentence = "The Council of 500 drew fifty members from each tribe.";

export const sampleOptions = [
  { id: "a", text: "The ten tribes mixed city, coast and inland." },
  { id: "b", text: "Each tribe sent fifty men to the Council." },
  { id: "c", text: "Tribes were chosen by wealth." },
  { id: "d", text: "Only Athenian-born men could vote." },
];

export function doNothing() {}
export async function doNothingLater() {}

// An XP bar that has finished filling at `xp` (no level-up shown).
export function makeSampleXpBar(atomId: string, xp: number, sentence = sampleSentence): XpBarChange {
  const level = getLevelFromXp(xp);
  return { atomId, sentence, xpBefore: xp, xpAfter: xp, xpGained: 0, levelBefore: level, levelAfter: level };
}

// An XP bar that moved from `xpBefore` to `xpAfter` on this answer.
export function makeSampleXpChange(atomId: string, xpBefore: number, xpAfter: number, sentence = sampleSentence) {
  return {
    atomId,
    sentence,
    xpBefore,
    xpAfter,
    xpGained: xpAfter - xpBefore,
    levelBefore: getLevelFromXp(xpBefore),
    levelAfter: getLevelFromXp(xpAfter),
  };
}

export function makeSampleAtom(atomId: string, xp: number): CourseViewAtom {
  const level = getLevelFromXp(xp);
  return {
    atomId,
    lectureId: "sample-lecture",
    sentence: sampleSentence,
    xp,
    level,
    nextLevelXp: getXpThresholdForLevel(level + 1),
    dueOn: "2026-11-20",
  };
}

const sampleResultBase: AnswerResult = {
  kind: "first",
  questionId: "sample-question",
  wasCorrect: true,
  chosenOptionIds: ["a"],
  correctOptionIds: ["a"],
  explanation: "Mixing the regions inside each tribe broke up the old local power bases.",
  mainAtom: { atomId: "sample-main", sentence: sampleSentence },
  xpBars: [],
  atomLevelUps: [],
  learnerLevelUp: null,
  cloutBefore: 100,
  cloutAfter: 100,
  cloutChange: 0,
  learnerLevel: 2,
  learnerTotalXp: 120,
  dueCount: 3,
  doorJustOpened: false,
};

// Right, at Hunch: the main atom levels up to 2, a linked atom gains a share.
export const sampleRightResult: AnswerResult = {
  ...sampleResultBase,
  xpBars: [makeSampleXpChange("sample-main", 15, 27), makeSampleXpChange("sample-linked", 4, 7, sampleLinkedSentence)],
  atomLevelUps: [{ atomId: "sample-main", sentence: sampleSentence, levelBefore: 1, levelAfter: 2 }],
  learnerLevelUp: { levelBefore: 1, levelAfter: 2 },
  cloutAfter: 110,
  cloutChange: 10,
};

// Wrong on a multi-select at Sure: chose a and c, the answer was a and b.
export const sampleWrongResult: AnswerResult = {
  ...sampleResultBase,
  wasCorrect: false,
  chosenOptionIds: ["a", "c"],
  correctOptionIds: ["a", "b"],
  xpBars: [makeSampleXpChange("sample-main", 30, 30)],
  cloutAfter: 75,
  cloutChange: -25,
};
