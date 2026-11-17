import { eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { question } from "@/server/db/schema";

type StatusChange = "unflag" | "delete";

// The two status changes the author page makes:
// - unflag: flagged -> active, back in rotation (the learner's note is kept);
// - delete: any status -> deleted. The row and its answer events remain, so
//   no XP earned from it is lost.
export async function setQuestionStatus(
  questionId: string,
  change: StatusChange,
): Promise<{ ok: true } | { ok: false; errors: string[] }> {
  const [existingQuestion] = await database
    .select({ status: question.status })
    .from(question)
    .where(eq(question.id, questionId));
  if (!existingQuestion) return { ok: false, errors: [`Question ${questionId} does not exist`] };

  if (change === "unflag" && existingQuestion.status !== "flagged") {
    return { ok: false, errors: [`Only a flagged question can be unflagged; this one is ${existingQuestion.status}`] };
  }

  await database
    .update(question)
    .set({ status: change === "unflag" ? "active" : "deleted", updatedAt: new Date() })
    .where(eq(question.id, questionId));
  return { ok: true };
}
