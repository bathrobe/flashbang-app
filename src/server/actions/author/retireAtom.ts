"use server";

import { requireAdmin } from "@/server/access";
import { retireAtom as retireAtomInContent } from "@/content/retireAtom";
import { atomIdInputShape, describeBadInput, type AuthorActionResult } from "./authorInputShapes";

// Retires an atom: out of sessions, XP kept. Always allowed.
export async function retireAtom(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = atomIdInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);
  return retireAtomInContent(parsed.data.atomId);
}
