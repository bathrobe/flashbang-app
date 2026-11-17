// What submitAnswer sends back to the browser once an answer is graded and
// saved. Built for the feedback panel (checklist item 12) and the end screen
// (item 14). The same object is stored on the review_event row (`result`), so
// a repeated submit gets back exactly what the first one got.

import type { CardKind } from "@/game/cardKind";

// One XP bar: an atom's XP and level before and after this answer.
export type XpBarChange = {
  atomId: string;
  sentence: string;
  xpBefore: number;
  xpAfter: number;
  xpGained: number;
  levelBefore: number;
  levelAfter: number;
};

export type AnswerResult = {
  kind: CardKind;
  questionId: string;
  wasCorrect: boolean;
  chosenOptionIds: string[];
  correctOptionIds: string[];
  explanation: string;
  mainAtom: { atomId: string; sentence: string };
  xpBars: XpBarChange[]; // the main atom first, then each linked atom
  atomLevelUps: { atomId: string; sentence: string; levelBefore: number; levelAfter: number }[];
  learnerLevelUp: { levelBefore: number; levelAfter: number } | null;
  cloutBefore: number;
  cloutAfter: number;
  cloutChange: number;
  learnerLevel: number; // after this answer
  learnerTotalXp: number; // after this answer
  dueCount: number; // what the navbar badge should now show
  doorJustOpened: boolean;
};

// "not_due": this atom was already answered (another tab, say). Nothing was saved.
export type SubmitAnswerResult = AnswerResult | { kind: "not_due" };
