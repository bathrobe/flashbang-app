"use server";

import { z } from "zod";
import { requireLearner } from "@/server/access";
import type { LoadCardResult } from "@/server/cardTypes";
import { loadCardForLearner } from "@/server/loadCardForLearner";
import { getLearnerToday } from "@/server/queries/learnerToday";

// The review session asks for the card of the atom at the front of its queue.
export async function loadCard(atomId: string): Promise<LoadCardResult> {
  const user = await requireLearner();
  const today = await getLearnerToday(user.id);
  return loadCardForLearner(user.id, z.string().min(1).parse(atomId), today);
}
