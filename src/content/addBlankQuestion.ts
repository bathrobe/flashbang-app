import { eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, question } from "@/server/db/schema";

// A new, empty question for the admin to fill in on the author page. It is
// always a draft, so it stays out of rotation until the lecture (or its
// drafts) are published, even though its blank fields do not pass the shape
// check yet. The first Save that passes the check makes it a real question.
export async function addBlankQuestion(atomId: string): Promise<{ ok: true; questionId: string } | { ok: false; errors: string[] }> {
  const [existingAtom] = await database.select({ id: atom.id }).from(atom).where(eq(atom.id, atomId));
  if (!existingAtom) return { ok: false, errors: [`Atom ${atomId} does not exist`] };

  const blankOption = () => ({ id: crypto.randomUUID().slice(0, 8), text: "", isCorrect: false });
  const [inserted] = await database
    .insert(question)
    .values({
      mainAtomId: atomId,
      format: "multiple_choice",
      prompt: "",
      options: [blankOption(), blankOption(), blankOption()],
      explanation: "",
      status: "draft",
    })
    .returning({ id: question.id });

  return { ok: true, questionId: inserted.id };
}
