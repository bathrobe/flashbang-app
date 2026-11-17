"use server";

import { z } from "zod";
import { requireLearner } from "@/server/access";
import { saveSoundOn } from "@/server/learnerState";

// The navbar's speaker toggle. The choice is stored on the account, not in the browser.
export async function setSoundOn(soundOn: boolean) {
  const user = await requireLearner();
  await saveSoundOn(user.id, z.boolean().parse(soundOn));
}
