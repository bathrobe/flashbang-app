import { database } from "@/server/db/client";
import { question, questionLink } from "@/server/db/schema";
import { assignOptionIds } from "./assignOptionIds";
import { findAppendErrors } from "./findAppendErrors";
import { findAtomErrors } from "./findAtomErrors";
import { findFirstGenerationErrors } from "./findFirstGenerationErrors";
import { lintQuestion } from "./lintQuestion";
import { checkQuestionShape, type CheckedQuestion } from "./questionShape";

type InsertQuestionsInput = {
  lectureId: string;
  questions: unknown; // straight from JSON; checked here
  isFirstGeneration: boolean; // true = apply the six-per-atom set rule; false = a top-up (--append)
};

type InsertQuestionsResult =
  | { ok: true; questionIds: string[]; warnings: string[] }
  | { ok: false; errors: string[] };

// Checks the WHOLE batch first, then inserts every question as a draft in one
// transaction. Any error means nothing is inserted. Lint warnings do not block.
export async function insertQuestions(input: InsertQuestionsInput): Promise<InsertQuestionsResult> {
  if (!Array.isArray(input.questions) || input.questions.length === 0) {
    return { ok: false, errors: ["Expected a JSON list with at least one question"] };
  }

  const shapeErrors: string[] = [];
  const checkedQuestions: CheckedQuestion[] = [];
  input.questions.forEach((rawQuestion, position) => {
    const shapeResult = checkQuestionShape(assignOptionIds(rawQuestion));
    if (shapeResult.ok) checkedQuestions.push(shapeResult.question);
    else shapeErrors.push(...shapeResult.errors.map((error) => `Question ${position + 1}: ${error}`));
  });
  if (shapeErrors.length > 0) return { ok: false, errors: shapeErrors };

  const errors = await findAtomErrors(input.lectureId, checkedQuestions);
  const findBatchErrors = input.isFirstGeneration ? findFirstGenerationErrors : findAppendErrors;
  errors.push(...(await findBatchErrors(input.lectureId, checkedQuestions)));
  if (errors.length > 0) return { ok: false, errors };

  const warnings = checkedQuestions.flatMap((checkedQuestion, position) =>
    lintQuestion(checkedQuestion).map((warning) => `Question ${position + 1}: ${warning}`),
  );

  // Ids are made here so the links can be inserted in the same transaction.
  // Each question's created time is one millisecond after the one before, so
  // the batch keeps its order when read back sorted by created time.
  const startTime = Date.now();
  const questionRows = checkedQuestions.map((checkedQuestion, position) => ({
    id: crypto.randomUUID(),
    mainAtomId: checkedQuestion.mainAtomId,
    format: checkedQuestion.format,
    prompt: checkedQuestion.prompt,
    options: checkedQuestion.options,
    explanation: checkedQuestion.explanation,
    isIntroductory: checkedQuestion.isIntroductory,
    imagePath: checkedQuestion.imagePath || null,
    imageCredit: checkedQuestion.imageCredit || null,
    imageKind: checkedQuestion.imageKind ?? null,
    status: "draft" as const,
    createdAt: new Date(startTime + position),
  }));
  const linkRows = checkedQuestions.flatMap((checkedQuestion, position) =>
    checkedQuestion.linkedAtoms.map((linkedAtom) => ({
      questionId: questionRows[position].id,
      atomId: linkedAtom.atomId,
      weight: linkedAtom.weight,
    })),
  );

  await database.transaction(async (transaction) => {
    await transaction.insert(question).values(questionRows);
    if (linkRows.length > 0) await transaction.insert(questionLink).values(linkRows);
  });

  return { ok: true, questionIds: questionRows.map((row) => row.id), warnings };
}
