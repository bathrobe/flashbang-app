import { findAtomDeleteBlockers } from "@/content/findAtomDeleteBlockers";
import { findLectureByNumber } from "@/content/findLecture";
import { lintQuestion } from "@/content/lintQuestion";
import { readLectureContent } from "@/content/readLectureContent";
import { loadAtomChoices } from "./loadAtomChoices";

// Everything the lecture editor shows, INCLUDING which options are correct.
// Only ever call this behind requireAdmin: no learner may see it.
// Returns null when there is no lecture with this number.
export async function getAuthorLecture(lectureNumber: number) {
  const lectureRow = await findLectureByNumber(lectureNumber);
  if (!lectureRow) return null;

  const [{ atoms, questions }, atomChoices] = await Promise.all([
    readLectureContent(lectureRow.id),
    loadAtomChoices(),
  ]);
  const deleteBlockers = await findAtomDeleteBlockers(atoms.map((atomRow) => atomRow.id));

  return {
    lecture: {
      id: lectureRow.id,
      number: lectureRow.number,
      title: lectureRow.title,
      status: lectureRow.status,
      publishedAt: lectureRow.publishedAt,
      // What "Publish drafts (N)" would activate: every draft question in the lecture.
      draftQuestionCount: questions.filter((questionRow) => questionRow.status === "draft").length,
    },
    atoms: atoms.map((atomRow) => ({
      id: atomRow.id,
      position: atomRow.position,
      sentence: atomRow.sentence,
      status: atomRow.status,
      deleteBlocker: deleteBlockers.get(atomRow.id) ?? null,
    })),
    // Deleted questions stay in the database but are hidden here.
    questions: questions
      .filter((questionRow) => questionRow.status !== "deleted")
      .map((questionRow) => ({
        id: questionRow.id,
        mainAtomId: questionRow.mainAtomId,
        format: questionRow.format,
        prompt: questionRow.prompt,
        options: questionRow.options,
        explanation: questionRow.explanation,
        isIntroductory: questionRow.isIntroductory,
        linkedAtoms: questionRow.linkedAtoms,
        imagePath: questionRow.imagePath,
        imageCredit: questionRow.imageCredit,
        imageKind: questionRow.imageKind,
        status: questionRow.status,
        flagNote: questionRow.flagNote,
        lintWarnings: lintQuestion(questionRow),
      })),
    atomChoices,
  };
}

export type AuthorLecture = NonNullable<Awaited<ReturnType<typeof getAuthorLecture>>>;
export type AuthorAtom = AuthorLecture["atoms"][number];
export type AuthorQuestion = AuthorLecture["questions"][number];
export type AtomChoice = AuthorLecture["atomChoices"][number];
