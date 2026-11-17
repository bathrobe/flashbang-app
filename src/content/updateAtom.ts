import { eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom } from "@/server/db/schema";

type UpdateAtomResult = { ok: true } | { ok: false; errors: string[] };

// Saves an atom's sentence. Never touches atom_progress: XP stays with the atom.
export async function updateAtom(atomId: string, fields: { sentence: string }): Promise<UpdateAtomResult> {
  const sentence = fields.sentence.trim();
  if (sentence.length === 0) return { ok: false, errors: ["The sentence is empty"] };

  const updatedAtoms = await database
    .update(atom)
    .set({ sentence })
    .where(eq(atom.id, atomId))
    .returning({ id: atom.id });
  if (updatedAtoms.length === 0) return { ok: false, errors: [`Atom ${atomId} does not exist`] };
  return { ok: true };
}
