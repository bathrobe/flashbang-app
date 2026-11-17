import { LevelUpCallout } from "@/components/feedback/LevelUpCallout";
import { formatCalendarDate } from "@/lib/formatCalendarDate";
import type { TodaySummary } from "@/server/queries/getTodaySummary";

type SessionTotalsProps = Pick<
  TodaySummary,
  "today" | "atomLevelUps" | "learnerLevelUp" | "clout" | "doorProgress" | "nextDueDate"
>;

function describeCloutChange(change: number) {
  if (change > 0) return `You won ${change} clout`;
  if (change < 0) return `You gave up ${Math.abs(change)} clout`;
  return "Your clout held steady";
}

function describeNextDue(nextDueDate: string | null, today: string) {
  if (!nextDueDate) return "Nothing is scheduled yet.";
  if (nextDueDate <= today) return "Something is still waiting today.";
  return `Next review: ${formatCalendarDate(nextDueDate)}`;
}

// Today's totals under the list: level-ups, clout, trial door progress and
// when the next review comes due.
export function SessionTotals({ today, atomLevelUps, learnerLevelUp, clout, doorProgress, nextDueDate }: SessionTotalsProps) {
  return (
    <section className="flex flex-col gap-3">
      {(atomLevelUps.length > 0 || learnerLevelUp) && (
        <div className="flex flex-col gap-2">
          {atomLevelUps.map((levelUp) => (
            <div key={levelUp.atomId} className="flex flex-col gap-1">
              <LevelUpCallout kind="atom" level={levelUp.levelNow} sentence={levelUp.sentence} />
              <span className="text-sm text-ink-muted">{levelUp.sentence}</span>
            </div>
          ))}
          {learnerLevelUp && <LevelUpCallout kind="learner" level={learnerLevelUp.levelNow} />}
        </div>
      )}

      <p data-clout-today={clout.change}>
        {describeCloutChange(clout.change)} today. Balance:{" "}
        <span className="font-number text-clout">{clout.balance}</span>
      </p>

      {doorProgress.map((door) => (
        <p key={door.lectureNumber} data-door-progress={door.isOpen ? "open" : `${door.atomsAtDoorLevel}/${door.atomCount}`}>
          {door.isOpen
            ? `Lecture ${door.lectureNumber} trial door: open. Coming soon.`
            : `Lecture ${door.lectureNumber} trial door: ${door.atomsAtDoorLevel} of ${door.atomCount} atoms at Level ${door.doorLevel}`}
        </p>
      ))}

      <p className="font-bold" data-next-due={nextDueDate ?? ""}>
        {describeNextDue(nextDueDate, today)}
      </p>
    </section>
  );
}
