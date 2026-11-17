import { readLectureContent } from "./readLectureContent";
import type { CheckedQuestion } from "./questionShape";

// The one check for a top-up (add-questions --append): an atom keeps a single
// introductory question, so a new introductory question is refused when the
// atom already has one, or when the batch brings two for the same atom.
export async function findAppendErrors(lectureId: string, questions: CheckedQuestion[]): Promise<string[]> {
  const newIntroductoryQuestions = questions.filter((question) => question.isIntroductory);
  if (newIntroductoryQuestions.length === 0) return [];

  const lectureContent = await readLectureContent(lectureId);
  const errors: string[] = [];

  for (const atomId of new Set(newIntroductoryQuestions.map((question) => question.mainAtomId))) {
    const existingCount = lectureContent.questions.filter(
      (existingQuestion) =>
        existingQuestion.mainAtomId === atomId && existingQuestion.isIntroductory && existingQuestion.status !== "deleted",
    ).length;
    const newCount = newIntroductoryQuestions.filter((question) => question.mainAtomId === atomId).length;

    if (existingCount + newCount > 1) {
      errors.push(
        `Atom ${atomId} would have ${existingCount + newCount} introductory questions (${existingCount} already there, ` +
          `${newCount} in this batch); an atom has exactly 1`,
      );
    }
  }

  return errors;
}
