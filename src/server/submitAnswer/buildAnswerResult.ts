import type { CardKind } from "@/game/cardKind";
import type { gradeAnswer } from "@/game/gradeAnswer";
import type { scoreAnswer } from "@/game/scoreAnswer";
import type { AnswerResult, OpenedDoor, XpBarChange } from "@/server/answerTypes";
import type { AnswerContext } from "./loadAnswerContext";

type Grade = ReturnType<typeof gradeAnswer>;
type Score = ReturnType<typeof scoreAnswer>;

type XpChange = Score["mainAtom"];

function toXpBar(atomId: string, sentence: string, change: XpChange): XpBarChange {
  const { xpBefore, xpAfter, xpGained, levelBefore, levelAfter } = change;
  return { atomId, sentence, xpBefore, xpAfter, xpGained, levelBefore, levelAfter };
}

type Extras = { dueCount: number; openedDoors: OpenedDoor[] };

// Puts the answer's outcome into the shape the browser gets (and the event row stores).
export function buildAnswerResult(context: AnswerContext, kind: CardKind, grade: Grade, score: Score, extras: Extras): AnswerResult {
  const mainAtomId = context.question.mainAtomId;
  const sentenceByAtomId = new Map(context.linkedAtoms.map((linkedAtom) => [linkedAtom.atomId, linkedAtom.sentence]));

  const xpBars = [
    toXpBar(mainAtomId, context.main.sentence, score.mainAtom),
    ...score.linkedAtoms.map((linked) => toXpBar(linked.atomId, sentenceByAtomId.get(linked.atomId) ?? "", linked)),
  ];

  return {
    kind,
    questionId: context.question.id,
    wasCorrect: grade.wasCorrect,
    chosenOptionIds: grade.chosenOptionIds,
    correctOptionIds: grade.correctOptionIds,
    explanation: context.question.explanation,
    mainAtom: { atomId: mainAtomId, sentence: context.main.sentence },
    xpBars,
    atomLevelUps: xpBars
      .filter((bar) => bar.levelAfter > bar.levelBefore)
      .map(({ atomId, sentence, levelBefore, levelAfter }) => ({ atomId, sentence, levelBefore, levelAfter })),
    learnerLevelUp: score.learner.leveledUp
      ? { levelBefore: score.learner.levelBefore, levelAfter: score.learner.levelAfter }
      : null,
    cloutBefore: score.clout.before,
    cloutAfter: score.clout.after,
    cloutChange: score.clout.change,
    learnerLevel: score.learner.levelAfter,
    learnerTotalXp: score.learner.totalXpAfter,
    dueCount: extras.dueCount,
    doorJustOpened: extras.openedDoors.length > 0,
    openedDoors: extras.openedDoors,
  };
}
