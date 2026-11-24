import type { FileQuestion } from "./lectureFileShape";

// Joe's rule: no prompt states the answer to another question on the same card.
// This is a word match, so it can only warn: it finds a prompt that contains the
// text of another question's correct answer.

const normalise = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

// The two directions of a people question share words on purpose.
const areOppositeDirections = (first: FileQuestion, second: FileQuestion) =>
  Boolean(first.direction && second.direction && first.direction !== second.direction);

export function findPromptLeaks(questions: FileQuestion[]): { questionId: string; warning: string }[] {
  const leaks: { questionId: string; warning: string }[] = [];
  for (const leakingQuestion of questions) {
    const paddedPrompt = ` ${normalise(leakingQuestion.prompt)} `;
    for (const otherQuestion of questions) {
      if (otherQuestion.id === leakingQuestion.id || otherQuestion.format === "true_false") continue;
      if (areOppositeDirections(leakingQuestion, otherQuestion)) continue;
      for (const correctOption of otherQuestion.options.filter((option) => option.isCorrect)) {
        if (paddedPrompt.includes(` ${normalise(correctOption.text)} `)) {
          leaks.push({
            questionId: leakingQuestion.id,
            warning: `The prompt contains "${correctOption.text}", the answer to "${otherQuestion.prompt}"`,
          });
        }
      }
    }
  }
  return leaks;
}
