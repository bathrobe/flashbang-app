// Mechanical checks for Joe's two hard rules about answer options. They return
// warnings, never errors: a warning is printed (or shown beside the question on
// the author page) and does not block saving. The generator's other rules need
// judgment and belong to the generate-questions skill.

export const lintSettings = {
  // Warn when the correct option is more than this many times the longest wrong one.
  correctLengthRatio: 1.3,
  absoluteWords: ["always", "never", "all", "none", "only", "every", "entirely", "completely"],
};

type QuestionForLint = { format: string; options: { text: string; isCorrect: boolean }[] };

// The absolute words found in the text, as whole words ("all" does not match "wall").
function findAbsoluteWords(text: string): string[] {
  const wordsInText: string[] = text.toLowerCase().match(/[a-z]+/g) ?? [];
  return lintSettings.absoluteWords.filter((absoluteWord) => wordsInText.includes(absoluteWord));
}

export function lintQuestion(question: QuestionForLint): string[] {
  // True/false options are just "True" and "False"; there is nothing to compare.
  if (question.format === "true_false") return [];

  const correctOptions = question.options.filter((option) => option.isCorrect);
  const wrongOptions = question.options.filter((option) => !option.isCorrect);
  if (correctOptions.length === 0 || wrongOptions.length === 0) return [];

  const warnings: string[] = [];

  // Rule 1: the correct answer must not stand out by being longer.
  const longestLength = (options: typeof correctOptions) =>
    Math.max(...options.map((option) => option.text.trim().length));
  const longestCorrect = longestLength(correctOptions);
  const longestWrong = longestLength(wrongOptions);
  if (longestCorrect > longestWrong * lintSettings.correctLengthRatio) {
    warnings.push(
      `The correct option (${longestCorrect} characters) is more than ${lintSettings.correctLengthRatio} times ` +
        `the longest wrong option (${longestWrong} characters)`,
    );
  }

  // Rule 2: absolute words only in the wrong answers give the right one away.
  const correctHasAbsoluteWord = correctOptions.some((option) => findAbsoluteWords(option.text).length > 0);
  const absoluteWordsInWrongOptions = [...new Set(wrongOptions.flatMap((option) => findAbsoluteWords(option.text)))];
  if (absoluteWordsInWrongOptions.length > 0 && !correctHasAbsoluteWord) {
    warnings.push(
      `A wrong option uses absolute language (${absoluteWordsInWrongOptions.join(", ")}) and no correct option does`,
    );
  }

  return warnings;
}
