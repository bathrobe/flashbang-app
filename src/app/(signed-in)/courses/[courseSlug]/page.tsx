import { notFound } from "next/navigation";
import { LectureRow } from "@/components/course/LectureRow";
import { TodayHeader } from "@/components/course/TodayHeader";
import { requireLearner } from "@/server/access";
import { getCourseView } from "@/server/queries/getCourseView";
import { getNextDueDate } from "@/server/queries/getNextDueDate";

// One course: all its lectures in order, with each started lecture's atoms.
// `?comeBack=1` means the learner pressed "Not yet" on the start-lecture step.
export default async function CoursePage({ params, searchParams }: PageProps<"/courses/[courseSlug]">) {
  const { courseSlug } = await params; // params and searchParams are promises in Next.js 16
  const { comeBack } = await searchParams;
  const user = await requireLearner();
  const [courseView, nextDueDate] = await Promise.all([
    getCourseView(user.id, courseSlug),
    getNextDueDate(user.id),
  ]);
  if (!courseView) notFound();

  return (
    <main className="mx-auto max-w-3xl p-4">
      <TodayHeader today={courseView.today} nextDueDate={nextDueDate} />
      {comeBack === "1" && (
        <p className="mb-4 font-bold">Come back once you&apos;ve listened to the lecture.</p>
      )}
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
