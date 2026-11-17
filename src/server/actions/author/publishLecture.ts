"use server";

import { z } from "zod";
import { requireAdmin } from "@/server/access";
import { publishLecture as publishLectureInContent } from "@/content/publishLecture";
import { describeBadInput, type AuthorActionResult } from "./authorInputShapes";

const publishLectureInputShape = z.object({ lectureId: z.string().min(1).max(100) });

// Publishes the whole lecture (or, if already published, its new drafts).
// Refused with every atom that has no questions named.
export async function publishLecture(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = publishLectureInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);

  const result = await publishLectureInContent(parsed.data.lectureId);
  if (result.ok) return { ok: true };
  if (result.atomsWithoutQuestions.length === 0) return { ok: false, errors: result.errors };
  return {
    ok: false,
    errors: result.atomsWithoutQuestions.map((atomRow) => `This atom has no questions: "${atomRow.sentence}"`),
  };
}
