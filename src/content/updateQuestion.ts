import { and, eq, ne } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, question, questionLink } from "@/server/db/schema";
import { assignOptionIds } from "./assignOptionIds";
import { findAtomErrors } from "./findAtomErrors";
import { lintQuestion } from "./lintQuestion";
import { checkQuestionShape } from "./questionShape";

type UpdateQuestionResult = { ok: true; warnings: string[] } | { ok: false; errors: string[] };

// Saves every editable field of one question, including its linked atoms.
// `fields` has the same shape as the content script's question JSON, with
// option ids kept for existing options. It never touches the question's status,
// atom_progress or review_event: past answers keep their own results.
export async function updateQuestion(questionId: string, fields: unknown): Promise<UpdateQuestionResult> {
  const [existingQuestion] = await database
    .select({ id: question.id, lectureId: atom.lectureId })
    .from(question)
    .innerJoin(atom, eq(atom.id, question.mainAtomId))
    .where(eq(question.id, questionId));
  if (!existingQuestion) return { ok: false, errors: [`Question ${questionId} does not exist`] };

  const shapeResult = checkQuestionShape(assignOptionIds(fields));
  if (!shapeResult.ok) return { ok: false, errors: shapeResult.errors };
  const checkedQuestion = shapeResult.question;

  // The main atom may change, but only to another atom of the same lecture.
  const atomErrors = await findAtomErrors(existingQuestion.lectureId, [checkedQuestion]);
  if (atomErrors.length > 0) {
    return { ok: false, errors: atomErrors.map((error) => error.replace("Question 1: ", "")) };
  }

  await database.transaction(async (transaction) => {
    await transaction
      .update(question)
      .set({
        mainAtomId: checkedQuestion.mainAtomId,
        format: checkedQuestion.format,
        prompt: checkedQuestion.prompt,
        options: checkedQuestion.options,
        explanation: checkedQuestion.explanation,
        isIntroductory: checkedQuestion.isIntroductory,
        imagePath: checkedQuestion.imagePath || null,
        imageCredit: checkedQuestion.imageCredit || null,
        imageKind: checkedQuestion.imageKind ?? null,
        updatedAt: new Date(),
      })
      .where(eq(question.id, questionId));

    // Simplest way to save the links: replace them all.
    await transaction.delete(questionLink).where(eq(questionLink.questionId, questionId));
    if (checkedQuestion.linkedAtoms.length > 0) {
      await transaction
        .insert(questionLink)
        .values(checkedQuestion.linkedAtoms.map((linkedAtom) => ({ questionId, ...linkedAtom })));
    }

    // An atom has one introductory question at most: marking this one unmarks the others.
    if (checkedQuestion.isIntroductory) {
      await transaction
        .update(question)
        .set({ isIntroductory: false })
        .where(and(eq(question.mainAtomId, checkedQuestion.mainAtomId), ne(question.id, questionId)));
    }
  });

  return { ok: true, warnings: lintQuestion(checkedQuestion) };
}
