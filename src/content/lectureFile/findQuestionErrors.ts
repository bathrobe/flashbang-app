import type { FileQuestion } from "./lectureFileShape";

// Hard rules that depend on the question's format. A question that breaks one
// cannot be shown, so these are errors, not warnings.

const optionCounts = {
  multiple_choice: { fewest: 3, most: 5 },
  multi_select: { fewest: 4, most: 6 },
  true_false: { fewest: 2, most: 2 },
  fill_blank: { fewest: 3, most: 5 },
};

export const blankMarker = "___";

export function findQuestionErrors(question: FileQuestion): string[] {
  const errors: string[] = [];
  const { format, options, prompt } = question;
  const { fewest, most } = optionCounts[format];
  const correctCount = options.filter((option) => option.isCorrect).length;

  if (options.length < fewest || options.length > most) {
    errors.push(`${format} needs ${fewest} to ${most} options, but this has ${options.length}`);
  }
  if (format === "multi_select" && correctCount < 1) {
    errors.push("multi_select needs at least one correct option");
  }
  if (format !== "multi_select" && correctCount !== 1) {
    errors.push(`${format} needs exactly one correct option, but this has ${correctCount}`);
  }
  if (format === "true_false" && options.map((option) => option.text).sort().join(",") !== "False,True") {
    errors.push('true_false options must be exactly "True" and "False"');
  }

  const blankCount = prompt.split(blankMarker).length - 1;
  if (format === "fill_blank" && blankCount !== 1) {
    errors.push(`fill_blank needs exactly one ${blankMarker} in the prompt, but this has ${blankCount}`);
  }

  const optionTexts = options.map((option) => option.text.toLowerCase());
  if (new Set(optionTexts).size !== optionTexts.length) {
    errors.push("two options have the same text");
  }
  return errors;
}
