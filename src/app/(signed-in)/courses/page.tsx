import Link from "next/link";
import { TodayHeader } from "@/components/course/TodayHeader";
import { Panel } from "@/components/ui/Panel";
import { requireLearner } from "@/server/access";
import { getCoursesList } from "@/server/queries/getCoursesList";
import { getNextDueDate } from "@/server/queries/getNextDueDate";

// The top-level list of courses. Stage 1 has exactly one.
export default async function CoursesPage() {
  const user = await requireLearner();
  const [{ today, courses }, nextDueDate] = await Promise.all([
    getCoursesList(user.id),
    getNextDueDate(user.id),
  ]);

  return (
    <main className="mx-auto max-w-3xl p-4">
      <TodayHeader today={today} nextDueDate={nextDueDate} />
      <ul className="flex flex-col gap-4">
        {courses.map((course) => (
          <li key={course.slug}>
            <Link href={`/courses/${course.slug}`} className="block">
              <Panel className="transition-transform duration-fast hover:-translate-x-px hover:-translate-y-px">
                <h2 className="font-display text-2xl">{course.title}</h2>
                <p className="text-ink-muted">{course.lecturer}</p>
                <p className="mt-2 flex flex-wrap gap-x-4">
                  <span>
                    <span className="font-number">{course.publishedLectureCount}</span> of{" "}
                    <span className="font-number">{course.lectureCount}</span> lectures
                  </span>
                  <span>
                    <span className="font-number">{course.dueCount}</span> atoms due
                  </span>
                </p>
              </Panel>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
