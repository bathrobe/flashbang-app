import { readLectureContent } from "./readLectureContent";
import { checkQuestionSet } from "./questionSetShape";
import type { CheckedQuestion } from "./questionShape";

// The extra checks for a first generation (add-questions without --append):
// every active atom in the lecture gets a complete set of six, and no atom
// already has questions (running the same batch twice would double them).
export async function findFirstGenerationErrors(lectureId: string, questions: CheckedQuestion[]): Promise<string[]> {
  const lectureContent = await readLectureContent(lectureId);
  const activeAtoms = lectureContent.atoms.filter((atom) => atom.status === "active");
  if (activeAtoms.length === 0) return ["This lecture has no atoms yet. Add them first with add-atoms"];

  const errors = checkQuestionSet(questions, activeAtoms);

  for (const atom of activeAtoms) {
    const existingCount = lectureContent.questions.filter(
      (existingQuestion) => existingQuestion.mainAtomId === atom.id && existingQuestion.status !== "deleted",
    ).length;
    if (existingCount > 0) {
      errors.push(`Atom ${atom.id} already has ${existingCount} questions. Use --append to add more`);
    }
  }

  return errors;
}
