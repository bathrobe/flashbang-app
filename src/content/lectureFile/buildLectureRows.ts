import { createHash } from "node:crypto";
import { buildTermQuestions } from "./buildTermQuestions";
import type { FileQuestion, LectureFile } from "./lectureFileShape";

// Turns a lecture file into the rows the database holds. No database here:
// this only decides what the rows say. Atoms, terms and people all become
// `atom` rows (see cardKinds in the schema), in that order.

export type CardRow = {
  id: string;
  kind: "atom" | "term" | "person";
  position: number;
  sentence: string;
  blurb: string;
  transcriptRef: string;
  details: Record<string, unknown>;
};

export type QuestionRow = {
  id: string;
  mainAtomId: string;
  format: FileQuestion["format"];
  rung: FileQuestion["rung"];
  prompt: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  isIntroductory: boolean;
};

// Answers are stored by option id, so the id comes from the option's text:
// the same text always gets the same id, on every load.
function makeOptionId(format: string, optionText: string) {
  if (format === "true_false") return optionText.trim().toLowerCase();
  return createHash("sha1").update(optionText.trim().toLowerCase()).digest("hex").slice(0, 8);
}

function makeQuestionRows(cardId: string, feedback: string, questions: FileQuestion[]): QuestionRow[] {
  return questions.map((question, questionIndex) => ({
    id: question.id,
    mainAtomId: cardId,
    format: question.format,
    rung: question.rung,
    prompt: question.prompt,
    options: question.options.map((option) => ({ ...option, id: makeOptionId(question.format, option.text) })),
    explanation: feedback,
    // The first question written for a card is the one a learner meets first.
    isIntroductory: questionIndex === 0,
  }));
}

const firstSentence = (value: string) => value.split(/(?<=\.)\s/)[0];

export function buildLectureRows(lectureFile: LectureFile): { cards: CardRow[]; questions: QuestionRow[] } {
  const cards: CardRow[] = [];
  const questions: QuestionRow[] = [];
  const addCard = (card: Omit<CardRow, "position">, cardQuestions: FileQuestion[]) => {
    cards.push({ ...card, position: cards.length + 1 });
    questions.push(...makeQuestionRows(card.id, card.blurb, cardQuestions));
  };

  for (const { id, sentence, blurb, transcriptRef, questions: atomQuestions, ...details } of lectureFile.atoms) {
    addCard({ id, kind: "atom", sentence, blurb, transcriptRef, details }, atomQuestions);
  }
  for (const term of lectureFile.terms) {
    const { id, transcriptRef, ...details } = term;
    const sentence = `${term.word} means "${term.meaning.toLowerCase()}".`;
    addCard({ id, kind: "term", sentence, blurb: term.description, transcriptRef, details }, buildTermQuestions(term, lectureFile.terms));
  }
  for (const { id, transcriptRef, questions: personQuestions, ...details } of lectureFile.people) {
    const sentence = `${details.name}, ${details.role.toLowerCase()}: ${firstSentence(details.description)}`;
    addCard({ id, kind: "person", sentence, blurb: details.description, transcriptRef, details }, personQuestions);
  }
  return { cards, questions };
}
