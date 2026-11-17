import type { AtomChoice } from "@/server/queries/getAuthorLecture";

// "L1.3 Cleisthenes reorganised the citizens into ten tribes…" for a picker.
export function atomChoiceLabel(choice: AtomChoice) {
  const shortSentence = choice.sentence.length > 70 ? `${choice.sentence.slice(0, 70)}…` : choice.sentence;
  return `L${choice.lectureNumber}.${choice.position} ${shortSentence}`;
}
