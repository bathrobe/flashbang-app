"use server";

import { requireAdmin } from "@/server/access";
import { updateAtom } from "@/content/updateAtom";
import { saveAtomInputShape, describeBadInput, type AuthorActionResult } from "./authorInputShapes";

// Saves an atom's sentence.
export async function saveAtom(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = saveAtomInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);
  return updateAtom(parsed.data.atomId, { sentence: parsed.data.sentence });
}
