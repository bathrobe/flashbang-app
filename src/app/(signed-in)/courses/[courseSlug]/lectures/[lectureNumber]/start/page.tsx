import { notFound, redirect } from "next/navigation";
import { StartLectureSteps } from "@/components/start/StartLectureSteps";
import { requireLearner } from "@/server/access";
import { getLectureStart } from "@/server/queries/getLectureStart";

// The short step before a lecture's first review: the listen check, then the atoms.
export default async function StartLecturePage({
  params,
}: PageProps<"/courses/[courseSlug]/lectures/[lectureNumber]/start">) {
  const { courseSlug, lectureNumber } = await params; // params is a promise in Next.js 16
  const user = await requireLearner();

  // Only whole numbers like "1"; anything else ("1.5", "abc") is a 404.
  if (!/^\d+$/.test(lectureNumber)) notFound();
  const lectureStart = await getLectureStart(user.id, courseSlug, Number(lectureNumber));
  if (!lectureStart || lectureStart.status !== "published") notFound();
  if (lectureStart.alreadyStarted) redirect(`/courses/${courseSlug}`);

  return (
    <main className="mx-auto max-w-2xl p-4">
      <StartLectureSteps
        lectureId={lectureStart.lectureId}
        lectureNumber={lectureStart.number}
        lectureTitle={lectureStart.title}
        courseSlug={courseSlug}
        atoms={lectureStart.atoms}
      />
    </main>
  );
}
