"use server";

import { z } from "zod";
import { requireLearner } from "@/server/access";
import { markDoorUnveiledForLearner } from "@/server/markDoorUnveiledForLearner";

// The trial door's unveiling has finished (or was closed). See markDoorUnveiledForLearner.
export async function markDoorUnveiled(lectureId: string) {
  const user = await requireLearner();
  await markDoorUnveiledForLearner(user.id, z.string().min(1).parse(lectureId));
}
