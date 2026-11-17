"use client";

import Link from "next/link";
import { useHud } from "@/components/hud/HudProvider";
import { getButtonLook } from "@/components/ui/buttonLook";
import { formatCalendarDate } from "@/lib/formatCalendarDate";

// On the courses view and the course view. The count comes from the HUD, so
// it is always the same number as the navbar's inbox badge.
export function BeginReview({ nextDueDate }: { nextDueDate: string | null }) {
  const { dueCount } = useHud();

  if (dueCount > 0) {
    return (
      <Link href="/review" className={getButtonLook("accent-1", "text-lg")}>
        Begin review ({dueCount})
      </Link>
    );
  }

  return (
    <div>
      <p className="font-display text-lg">Nothing due</p>
      <p className="text-ink-muted">
        {nextDueDate ? `Next: ${formatCalendarDate(nextDueDate)}` : "Start a lecture to fill your inbox."}
      </p>
    </div>
  );
}
