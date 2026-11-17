"use client";

import Link from "next/link";
import { useHud } from "@/components/hud/HudProvider";
import { Popover } from "@/components/ui/Popover";
import { formatCalendarDate } from "@/lib/formatCalendarDate";

const inboxLook = "relative flex items-center rounded-frame border-thick border-outline bg-panel p-1";

// Something due: a badge with the count, and a click starts the review.
// Nothing due: no badge, and a click says when the next atom comes due.
export function InboxButton({ nextDueDate }: { nextDueDate: string | null }) {
  const { dueCount } = useHud();

  if (dueCount > 0) {
    return (
      <Link href="/review" aria-label={`Inbox: ${dueCount} due. Begin review`} className={inboxLook}>
        <InboxIcon />
        <span className="absolute -right-3 -top-3 min-w-6 rounded-frame border-thick border-outline bg-accent-1 px-1 text-center font-number text-xs text-accent-1-ink">
          {dueCount}
        </span>
      </Link>
    );
  }

  return (
    <Popover trigger={<InboxIcon />} triggerLabel="Inbox: nothing due" triggerClassName={inboxLook}>
      {nextDueDate ? (
        <p>Nothing due. Next: {formatCalendarDate(nextDueDate)}</p>
      ) : (
        <p>Nothing due. Start a lecture to fill your inbox.</p>
      )}
    </Popover>
  );
}

// An inbox tray, drawn in the current text colour.
function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M3 13 6 4h12l3 9v7H3z" />
      <path d="M3 13h5l1 3h6l1-3h5" />
    </svg>
  );
}
