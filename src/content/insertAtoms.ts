import { eq, max } from "drizzle-orm";
import { z } from "zod";
import { database } from "@/server/db/client";
import { atom } from "@/server/db/schema";

const newAtomsShape = z
  .array(
    z.object({
      sentence: z.string("is missing").trim().min(1, "is empty"),
      transcriptRef: z.string().trim().nullish(),
    }),
    "Expected a JSON list of atoms: [{ sentence, transcriptRef }]",
  )
  .min(1, "The list of atoms is empty");

type InsertAtomsResult =
  | { ok: true; atoms: { id: string; position: number; sentence: string }[] }
  | { ok: false; errors: string[] };

// Adds atoms to the end of a lecture, in the order given. All or nothing.
export async function insertAtoms(input: { lectureId: string; atoms: unknown }): Promise<InsertAtomsResult> {
  const parsed = newAtomsShape.safeParse(input.atoms);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) =>
      issue.path.length > 0 ? `Atom ${Number(issue.path[0]) + 1}: ${issue.path.slice(1).join(".")} ${issue.message}` : issue.message,
    );
    return { ok: false, errors };
  }

  const insertedAtoms = await database.transaction(async (transaction) => {
    const [{ lastPosition }] = await transaction
      .select({ lastPosition: max(atom.position) })
      .from(atom)
      .where(eq(atom.lectureId, input.lectureId));

    return transaction
      .insert(atom)
      .values(
        parsed.data.map((newAtom, index) => ({
          lectureId: input.lectureId,
          position: (lastPosition ?? 0) + index + 1,
          sentence: newAtom.sentence,
          transcriptRef: newAtom.transcriptRef || null,
        })),
      )
      .returning({ id: atom.id, position: atom.position, sentence: atom.sentence });
  });

  return { ok: true, atoms: insertedAtoms.sort((first, second) => first.position - second.position) };
}
