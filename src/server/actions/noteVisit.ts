"use server";

import { z } from "zod";
import { requireLearner } from "@/server/access";
import { recordVisit } from "@/server/learnerState";

// Called once per page load by VisitReporter with the browser's time-zone
// name, e.g. "America/New_York". Also starts an eased return after a gap.
export async function noteVisit(timeZone: string) {
  const user = await requireLearner();
  const checkedTimeZone = z.string().min(1).max(100).parse(timeZone);
  return recordVisit(user.id, checkedTimeZone);
}
