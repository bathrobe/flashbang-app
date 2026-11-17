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
      .then(({ timeZoneChanged }) => {
        // A new time zone can change what is due today, so ask the server again.
        if (timeZoneChanged) router.refresh();
      })
      .catch(() => {
        // Not worth interrupting anyone: the server keeps the zone it had.
      });
  }, [router]);

  return null;
}
