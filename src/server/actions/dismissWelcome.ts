"use server";

import { requireLearner } from "@/server/access";
import { dismissWelcomeForLearner } from "@/server/easedReturn";

// The welcome-back message's "Start" and "Not now" both call this, so the
// message is shown once per return.
export async function dismissWelcome() {
  const user = await requireLearner();
  await dismissWelcomeForLearner(user.id);
}
