import Link from "next/link";
import { getButtonLook } from "@/components/ui/buttonLook";
import { Panel } from "@/components/ui/Panel";
import type { CourseViewLecture } from "@/server/queries/getCourseView";
import { AtomToken } from "./AtomToken";
import { TrialDoor } from "./TrialDoor";
import { atomTokenSquare } from "./atomTokenLook";

// An unpublished lecture's atoms are unknown until its conversation happens,
// so it shows this many empty slots.
const placeholderSlotCount = 7;

// One lecture on the course view, in one of three states.
export function LectureRow({ lecture, courseSlug }: { lecture: CourseViewLecture; courseSlug: string }) {
  if (lecture.state === "draft") return <DraftLectureRow lecture={lecture} />;

  return (
    <Panel>
      <LectureHeading lecture={lecture} />
      {lecture.state === "not_started" ? (
        <Link
          href={`/courses/${courseSlug}/lectures/${lecture.number}/start`}
          className={getButtonLook("accent-3", "mt-3")}
        >
          Start Lecture {lecture.number}
        </Link>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {lecture.atoms.map((atom) => (
            <AtomToken key={atom.atomId} atom={atom} />
          ))}
          <span className="ml-2 text-sm">
            {lecture.dueCount > 0 ? (
              <>
                <span className="font-number">{lecture.dueCount}</span> due
              </>
            ) : (
              <span className="text-ink-muted">Nothing due</span>
            )}
          </span>
          {lecture.door && (
            <div className="ml-auto">
              <TrialDoor door={lecture.door} />
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function LectureHeading({ lecture }: { lecture: CourseViewLecture }) {
  return (
    <h2 className="flex items-baseline gap-3">
      <span className="font-number text-lg">{lecture.number}</span>
      <span className="font-display">{lecture.title}</span>
    </h2>
  );
}

// Waiting to be unlocked: a dashed, unframed row with empty slots. Muted
// rather than broken-looking, and not a link.
function DraftLectureRow({ lecture }: { lecture: CourseViewLecture }) {
  return (
    <div className="rounded-frame border-thick border-dashed border-ink-muted p-4 text-ink-muted">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <LectureHeading lecture={lecture} />
        <span className="text-sm">Not yet unlocked</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" aria-hidden="true">
        {Array.from({ length: placeholderSlotCount }, (_, slotIndex) => (
          <span key={slotIndex} className={`${atomTokenSquare} border-dashed border-ink-muted`} />
        ))}
      </div>
    </div>
  );
}
