import type { FileQuestion, LectureFile } from "./lectureFileShape";

// Terms have no written questions. Each term is asked two ways from a template:
// see the word and pick the meaning, or see the meaning and pick the word.
// The wrong answers are the other terms, so a term needs at least two others.
// Ids are built from the term's id, so they stay the same on every load.

type Term = LectureFile["terms"][number];

const mostWrongOptions = 3;

export function buildTermQuestions(term: Term, allTerms: Term[]): FileQuestion[] {
  const otherTerms = allTerms.filter((otherTerm) => otherTerm.id !== term.id).slice(0, mostWrongOptions);
  if (otherTerms.length < 2) return [];

  const makeQuestion = (idEnding: string, prompt: string, pickText: (anyTerm: Term) => string): FileQuestion => ({
    id: `${term.id}:${idEnding}`,
    format: "multiple_choice",
    rung: "recall",
    prompt,
    imageUse: "optional",
    options: [
      { text: pickText(term), isCorrect: true },
      ...otherTerms.map((otherTerm) => ({ text: pickText(otherTerm), isCorrect: false })),
    ],
  });

  return [
    makeQuestion("word-to-meaning", `What does ${term.word} mean?`, (anyTerm) => anyTerm.meaning),
    makeQuestion("meaning-to-word", `Which word means "${term.meaning.toLowerCase()}"?`, (anyTerm) => anyTerm.word),
  ];
}
