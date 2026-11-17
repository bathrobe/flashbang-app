"use server";

import { requireAdmin } from "@/server/access";
import { addBlankQuestion } from "@/content/addBlankQuestion";
import { atomIdInputShape, describeBadInput, type AuthorActionResult } from "./authorInputShapes";

// Adds a blank draft question under an atom, for the admin to fill in.
export async function addQuestion(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = atomIdInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);
  return addBlankQuestion(parsed.data.atomId);
}
