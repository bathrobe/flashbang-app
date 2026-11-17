"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { noteVisit } from "@/server/actions/noteVisit";

// Draws nothing. On each page load it tells the server the browser's time
// zone, which decides what "today" means for due dates.
export function VisitReporter() {
  const router = useRouter();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    noteVisit(timeZone)
      .then(({ timeZoneChanged, easedReturnStarted }) => {
        // A new time zone can change what is due today, and a return after a
        // gap brings the welcome-back message and the short count: ask again.
        if (timeZoneChanged || easedReturnStarted) router.refresh();
      })
      .catch(() => {
        // Not worth interrupting anyone: the server keeps the zone it had.
      });
  }, [router]);

  return null;
}
