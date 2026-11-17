"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireLearner } from "@/server/access";
import { getLearnerToday } from "@/server/queries/learnerToday";
import { startLectureForLearner } from "@/server/startLectureForLearner";

// "Begin" on the start-lecture step. On success it goes straight to the
// review session; on failure it returns a message for the button to show.
export async function startLecture(lectureId: string) {
  const user = await requireLearner();
  const today = await getLearnerToday(user.id);
  const result = await startLectureForLearner(user.id, z.string().min(1).parse(lectureId), today);
  if (!result.ok) return { message: result.message };
  // redirect() works by throwing, so it must stay outside any try/catch.
  redirect("/review");
}
