"use server";

import { requireAdmin } from "@/server/access";
import { deleteAtom as deleteAtomInContent } from "@/content/deleteAtom";
import { atomIdInputShape, describeBadInput, type AuthorActionResult } from "./authorInputShapes";

// Deletes an atom, refused when a learner has XP on it or answers are recorded.
export async function deleteAtom(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = atomIdInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);
  return deleteAtomInContent(parsed.data.atomId);
}
