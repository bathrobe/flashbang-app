import { notFound } from "next/navigation";
import { LectureRow } from "@/components/course/LectureRow";
import { TodayHeader } from "@/components/course/TodayHeader";
import { requireLearner } from "@/server/access";
import { getCourseView } from "@/server/queries/getCourseView";
import { getNextDueDate } from "@/server/queries/getNextDueDate";

// One course: all its lectures in order, with each started lecture's atoms.
export default async function CoursePage({ params }: PageProps<"/courses/[courseSlug]">) {
  const { courseSlug } = await params; // params is a promise in Next.js 16
  const user = await requireLearner();
  const [courseView, nextDueDate] = await Promise.all([
    getCourseView(user.id, courseSlug),
    getNextDueDate(user.id),
  ]);
  if (!courseView) notFound();

  return (
    <main className="mx-auto max-w-3xl p-4">
      <TodayHeader today={courseView.today} nextDueDate={nextDueDate} />
      <h2 className="font-display text-2xl">{courseView.course.title}</h2>
      <p className="mb-4 text-ink-muted">{courseView.course.lecturer}</p>
      <ol className="flex flex-col gap-3">
        {courseView.lectures.map((lecture) => (
          <li key={lecture.lectureId}>
            <LectureRow lecture={lecture} courseSlug={courseView.course.slug} />
          </li>
        ))}
      </ol>
    </main>
  );
}
