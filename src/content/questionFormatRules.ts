import type { CheckedQuestion } from "./questionShape";

// The rules that depend on the format, and the ones that compare two fields.
// Each returns plain-word errors; an empty list means the question is fine.

const optionCountRules = {
  multiple_choice: { fewest: 3, most: 5, name: "Multiple choice" },
  multi_select: { fewest: 4, most: 6, name: "Multi-select" },
  true_false: { fewest: 2, most: 2, name: "True/false" },
};

export function findFormatRuleErrors(question: CheckedQuestion): string[] {
  const errors: string[] = [];
  const { options, format, linkedAtoms } = question;
  const correctCount = options.filter((option) => option.isCorrect).length;
  const { fewest, most, name } = optionCountRules[format];

  if (options.length < fewest || options.length > most) {
    const allowed = fewest === most ? `exactly ${fewest}` : `${fewest} to ${most}`;
    errors.push(`${name} needs ${allowed} options, but this has ${options.length}`);
  }

  if (format === "multi_select" && correctCount < 1) {
    errors.push("Multi-select needs at least one correct option");
  }
  if (format !== "multi_select" && correctCount !== 1) {
    errors.push(`${name} needs exactly one correct option, but this has ${correctCount}`);
  }

  const optionIds = options.map((option) => option.id);
  if (format === "true_false" && [...optionIds].sort().join(",") !== "false,true") {
    errors.push('True/false options must be exactly "True" and "False"');
  }
  if (new Set(optionIds).size !== optionIds.length) {
    errors.push("Two options share the same id");
  }

  const linkedAtomIds = linkedAtoms.map((linkedAtom) => linkedAtom.atomId);
  if (linkedAtomIds.includes(question.mainAtomId)) {
    errors.push("A linked atom is the same as the main atom");
  }
  if (new Set(linkedAtomIds).size !== linkedAtomIds.length) {
    errors.push("The same atom is linked twice");
  }

  if (question.imagePath && !question.imageCredit) {
    errors.push("An image needs a credit (imageCredit)");
  }

  return errors;
}
