import { eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom } from "@/server/db/schema";

// Retiring is always allowed. A retired atom leaves sessions, the door
// requirement and the course view, but its progress rows (and XP) remain.
// There is no un-retire in Stage 1.
export async function retireAtom(atomId: string): Promise<{ ok: true } | { ok: false; errors: string[] }> {
  const retiredAtoms = await database
    .update(atom)
    .set({ status: "retired" })
    .where(eq(atom.id, atomId))
    .returning({ id: atom.id });
  if (retiredAtoms.length === 0) return { ok: false, errors: [`Atom ${atomId} does not exist`] };
  return { ok: true };
}
