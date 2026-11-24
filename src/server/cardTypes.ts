// What loadCard sends to the browser. Shared by the server (which builds it)
// and the review components (which show it); the browser imports types only.
//
// On purpose there is no isCorrect, no explanation and no atom sentence here:
// the server grades, so the browser learns the answer only after submitting.

// A fill-the-blank is a multiple choice whose prompt has a ___ in it.
export type QuestionFormat = "multiple_choice" | "multi_select" | "true_false" | "fill_blank";

export type CardOption = { id: string; text: string };

export type CardImage = { path: string; credit: string | null; kind: "sourced" | "generated" | null };

export type ShowableCard = {
  kind: "first" | "retry"; // first attempt today, or a retry after a miss
  isNew: boolean; // the atom's first ever card: labelled "New"
  questionId: string;
  format: QuestionFormat;
  prompt: string;
  options: CardOption[]; // already in the order to show them
  image: CardImage | null;
};

// "not_due" and "no_questions" tell the session to skip this atom.
export type LoadCardResult = ShowableCard | { kind: "not_due" } | { kind: "no_questions" };
