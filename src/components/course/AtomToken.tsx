"use client";

import { Popover } from "@/components/ui/Popover";
import { formatCalendarDate } from "@/lib/formatCalendarDate";
import type { CourseViewAtom } from "@/server/queries/loadStartedLectureAtoms";
import { atomTokenSquare, getAtomTokenLook } from "./atomTokenLook";

// One atom on the course view. Pointing at it, clicking it, or tabbing to it
// and pressing Enter shows its sentence, level, XP and next due date.
export function AtomToken({ atom }: { atom: CourseViewAtom }) {
  return (
    <Popover
      openOnHover
      align="left"
      panelWidthClassName="w-72 max-w-[80vw]"
      triggerLabel={`Level ${atom.level} atom: ${atom.sentence}`}
      triggerClassName={`${atomTokenSquare} ${getAtomTokenLook(atom.level)} font-number text-sm`}
      trigger={atom.level}
    >
      <p className="mb-2">{atom.sentence}</p>
      <p className="text-sm">
        Level <span className="font-number">{atom.level}</span> ·{" "}
        <span className="font-number text-xp">
          {atom.xp} / {atom.nextLevelXp}
        </span>{" "}
        XP
      </p>
      <p className="text-sm text-ink-muted">
        {atom.dueOn ? `Next due: ${formatCalendarDate(atom.dueOn)}` : "Not scheduled yet"}
      </p>
    </Popover>
  );
}
