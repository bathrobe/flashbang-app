import type { FileQuestion } from "./lectureFileShape";

// Joe's rule: answer choices are about the same length, right or wrong.
// The older check in ../lintQuestion.ts only catches a long *correct* answer;
// this one catches any option that stands out by length.

export const unevenOptionSettings = {
  // Warn when the longest option is more than this many times the shortest…
  lengthRatio: 2,
  // …and the gap is at least this many characters (so "No" beside "Yes" is fine).
  smallestGapThatMatters: 9,
};

export function findUnevenOptions(question: FileQuestion): string[] {
  if (question.format === "true_false") return [];
  const lengths = question.options.map((option) => option.text.trim().length);
  const longest = Math.max(...lengths);
  const shortest = Math.min(...lengths);
  const { lengthRatio, smallestGapThatMatters } = unevenOptionSettings;
  if (longest > shortest * lengthRatio && longest - shortest >= smallestGapThatMatters) {
    return [`Options are uneven: the longest is ${longest} characters and the shortest is ${shortest}`];
  }
  return [];
}
