import Link from "next/link";
import { requireAdmin } from "@/server/access";
import { getAuthorLectureList } from "@/server/queries/getAuthorLectureList";

// The author page's front list: every lecture, its status and counts.
export default async function AuthorPage() {
  // Checked here too: a layout and its page can render in parallel.
  await requireAdmin({ calledFrom: "page" });
  const lectures = await getAuthorLectureList();

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 font-display text-2xl">Author</h1>
      <ol className="flex flex-col gap-2">
        {lectures.map((lecture) => (
          <li key={lecture.number} className="border-b-thick border-outline pb-2">
            <Link href={`/author/${lecture.number}`} className="font-bold underline">
              Lecture {lecture.number}: {lecture.title}
            </Link>
            <p className="text-ink-muted">
              {lecture.status} · {lecture.atomCount} atoms · {lecture.questionCount} questions
            </p>
          </li>
        ))}
      </ol>
    </main>
  );
}
