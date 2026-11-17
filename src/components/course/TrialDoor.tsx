"use client";

import { Popover } from "@/components/ui/Popover";
import type { CourseViewDoor } from "@/server/queries/getCourseView";

const doorIcon = "inline-block h-8 w-5 border-thick border-door-edge";

// A started lecture's trial door on the course view. Locked: the requirement
// in words and the progress toward it. Open (for good, once door_opened_at is
// set): an open door that says "Coming soon." when clicked, and nothing else.
export function TrialDoor({ door }: { door: CourseViewDoor }) {
  if (!door.isOpen) {
    return (
      <div data-trial-door="locked" className="flex items-center gap-2 text-sm">
        <span aria-hidden="true" className={`${doorIcon} bg-door-fill`} />
        <span>
          Trial door: All {door.atomCount} atoms at Level {door.doorLevel} ·{" "}
          <span className="font-number">
            {door.atomsAtDoorLevel} of {door.atomCount}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div data-trial-door="open">
      <Popover
        align="right"
        triggerLabel="Trial door, open"
        triggerClassName="flex items-center gap-2 text-sm font-bold"
        trigger={
          <>
            <span aria-hidden="true" className={`${doorIcon} bg-door-light`} />
            Trial door: open
          </>
        }
      >
        <p className="font-display">Coming soon.</p>
      </Popover>
    </div>
  );
}
