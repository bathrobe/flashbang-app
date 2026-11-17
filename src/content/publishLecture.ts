import { and, eq, inArray, sql } from "drizzle-orm";
import { database } from "@/server/db/client";
import { lecture, question } from "@/server/db/schema";
import { readLectureContent } from "./readLectureContent";

type PublishLectureResult =
  | { ok: true; activatedQuestionCount: number; wasAlreadyPublished: boolean }
  | { ok: false; errors: string[]; atomsWithoutQuestions: { id: string; sentence: string }[] };

// Publishes a lecture: it becomes `published` and every draft question in it
// becomes `active`. Run again on a published lecture, it activates new drafts.
// Refused, naming the atoms, if any active atom has no draft or active question.
export async function publishLecture(lectureId: string): Promise<PublishLectureResult> {
  const [lectureRow] = await database.select().from(lecture).where(eq(lecture.id, lectureId));
  if (!lectureRow) return { ok: false, errors: [`Lecture ${lectureId} does not exist`], atomsWithoutQuestions: [] };

  const { atoms, questions } = await readLectureContent(lectureId);
  const activeAtoms = atoms.filter((atom) => atom.status === "active");
  if (activeAtoms.length === 0) {
    return { ok: false, errors: ["This lecture has no atoms, so there is nothing to publish"], atomsWithoutQuestions: [] };
  }

  const usableQuestions = questions.filter((row) => row.status === "draft" || row.status === "active");
  const atomsWithoutQuestions = activeAtoms
    .filter((atom) => !usableQuestions.some((row) => row.mainAtomId === atom.id))
    .map((atom) => ({ id: atom.id, sentence: atom.sentence }));
  if (atomsWithoutQuestions.length > 0) {
    const errors = atomsWithoutQuestions.map((atom) => `Atom "${atom.sentence}" (${atom.id}) has no draft or active question`);
    return { ok: false, errors, atomsWithoutQuestions };
  }

  const atomIds = atoms.map((atom) => atom.id);
  const activatedQuestions = await database.transaction(async (transaction) => {
    await transaction
      .update(lecture)
      // coalesce keeps the first publishing time when new drafts are published later.
      .set({ status: "published", publishedAt: sql`coalesce(${lecture.publishedAt}, now())` })
      .where(eq(lecture.id, lectureId));

    return transaction
      .update(question)
      .set({ status: "active", updatedAt: new Date() })
      .where(and(inArray(question.mainAtomId, atomIds), eq(question.status, "draft")))
      .returning({ id: question.id });
  });

  return {
    ok: true,
    activatedQuestionCount: activatedQuestions.length,
    wasAlreadyPublished: lectureRow.status === "published",
  };
}
