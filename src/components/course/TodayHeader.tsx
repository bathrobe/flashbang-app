import { formatCalendarDate } from "@/lib/formatCalendarDate";
import { BeginReview } from "./BeginReview";

// Top of the courses view and the course view: today's date in large type,
// and the begin-review control beside it.
export function TodayHeader({ today, nextDueDate }: { today: string; nextDueDate: string | null }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-display text-4xl sm:text-5xl">{formatCalendarDate(today)}</h1>
      <BeginReview nextDueDate={nextDueDate} />
    </header>
  );
}
