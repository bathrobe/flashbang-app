import type { QuestionOption } from "@/server/db/schema/content";
import type { CardOption, QuestionFormat } from "./cardTypes";

// Fisher–Yates shuffle on a copy: every order is equally likely.
function shuffle<Item>(items: Item[]): Item[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

// The options as the browser should show them: id and text only (never
// isCorrect). Multiple choice and multi-select are shuffled on every showing;
// true/false always reads True, then False.
export function orderCardOptions(format: QuestionFormat, storedOptions: QuestionOption[]): CardOption[] {
  const idAndTextOnly = storedOptions.map((option) => ({ id: option.id, text: option.text }));
  if (format !== "true_false") return shuffle(idAndTextOnly);

  const trueOption = idAndTextOnly.find((option) => option.id === "true");
  const falseOption = idAndTextOnly.find((option) => option.id === "false");
  return [trueOption, falseOption].filter((option) => option !== undefined);
}
