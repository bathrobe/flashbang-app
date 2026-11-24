import { lintQuestion } from "../lintQuestion";
import { findPromptLeaks } from "./findPromptLeaks";
import { findQuestionErrors } from "./findQuestionErrors";
import { findUnevenOptions } from "./findUnevenOptions";
import type { FileQuestion, LectureFile } from "./lectureFileShape";

// Every mechanical check on a lecture file, gathered into one report.
// Errors must be fixed. Warnings should be fixed, or explained on the question
// with `checkedByHand`. The rules that need judgment (is it obvious? is a wrong
// answer arguably right?) live in the author-lecture skill, not here.

export type LectureFileReport = { errors: string[]; warnings: string[]; checkedByHand: string[] };

type Card = { label: string; questions: FileQuestion[] };

const shorten = (value: string) => (value.length > 50 ? `${value.slice(0, 47)}…` : value);

function lintCard(card: Card, report: LectureFileReport) {
  const leaks = findPromptLeaks(card.questions);
  for (const question of card.questions) {
    const where = `${card.label}, "${shorten(question.prompt)}"`;
    report.errors.push(...findQuestionErrors(question).map((error) => `${where}: ${error}`));

    const warnings = [
      ...lintQuestion(question),
      ...findUnevenOptions(question),
      ...leaks.filter((leak) => leak.questionId === question.id).map((leak) => leak.warning),
    ];
    if (warnings.length === 0) continue;
    if (question.checkedByHand) report.checkedByHand.push(`${where}: ${question.checkedByHand}`);
    else report.warnings.push(...warnings.map((warning) => `${where}: ${warning}`));
  }
}

// `wordsKeptOutOfAtoms` are names an atom's sentence must not use, such as the lecturer's.
export function lintLectureFile(lectureFile: LectureFile, wordsKeptOutOfAtoms: string[] = []): LectureFileReport {
  const report: LectureFileReport = { errors: [], warnings: [], checkedByHand: [] };

  lectureFile.atoms.forEach((atom, atomIndex) => {
    const label = `Atom ${atomIndex + 1}`;
    for (const word of wordsKeptOutOfAtoms) {
      if (atom.sentence.toLowerCase().includes(word.toLowerCase())) {
        report.warnings.push(`${label}: the sentence names "${word}"; atoms are stated as plain facts`);
      }
    }
    if (atom.questions.length === 0) report.errors.push(`${label}: has no questions`);
    lintCard({ label, questions: atom.questions }, report);
  });

  for (const person of lectureFile.people) lintCard({ label: person.name, questions: person.questions }, report);

  const allIds = [
    ...lectureFile.atoms.flatMap((atom) => [atom.id, ...atom.questions.map((question) => question.id)]),
    ...lectureFile.terms.map((term) => term.id),
    ...lectureFile.people.flatMap((person) => [person.id, ...person.questions.map((question) => question.id)]),
  ];
  const repeatedIds = allIds.filter((id, position) => allIds.indexOf(id) !== position);
  for (const repeatedId of new Set(repeatedIds)) report.errors.push(`The id ${repeatedId} is used more than once`);

  return report;
}
