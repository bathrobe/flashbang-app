import Link from "next/link";
import { notFound } from "next/navigation";
import { AtomEditor } from "@/components/author/AtomEditor";
import { FlaggedList } from "@/components/author/FlaggedList";
import { PublishBar } from "@/components/author/PublishBar";
import { requireAdmin } from "@/server/access";
import { getAuthorLecture } from "@/server/queries/getAuthorLecture";
import { getLearnerToday } from "@/server/queries/learnerToday";

// One lecture's editor: the Publish bar, flagged questions, then each atom
// with its questions beneath.
export default async function AuthorLecturePage({ params }: PageProps<"/author/[lectureNumber]">) {
  // getAuthorLecture includes correct answers, so the admin check comes first.
  const admin = await requireAdmin({ calledFrom: "page" });
  const { lectureNumber } = await params;
  const number = Number(lectureNumber);
  if (!Number.isInteger(number)) notFound();
  const authorLecture = await getAuthorLecture(number);
  if (!authorLecture) notFound();

  const { lecture, atoms, questions, atomChoices } = authorLecture;
  // The publishing day as a date in the admin's own time zone, for "Published <date>".
  const publishedOn = lecture.publishedAt ? await getLearnerToday(admin.id, lecture.publishedAt) : null;
  const lectureAtomChoices = atomChoices.filter((choice) => choice.lectureNumber === lecture.number);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
      <div>
        <Link href="/author" className="underline">All lectures</Link>
        <h1 className="font-display text-2xl">
          Lecture {lecture.number}: {lecture.title}
        </h1>
        <p className="text-ink-muted">Status: {lecture.status}</p>
      </div>

      <PublishBar
        lectureId={lecture.id}
        lectureStatus={lecture.status}
        draftQuestionCount={lecture.draftQuestionCount}
        publishedOn={publishedOn}
      />

      <FlaggedList questions={questions.filter((question) => question.status === "flagged")} />

      {atoms.map((atom) => (
        <AtomEditor
          key={atom.id}
          atom={atom}
          questions={questions.filter((question) => question.mainAtomId === atom.id)}
          lectureAtomChoices={lectureAtomChoices}
          allAtomChoices={atomChoices}
        />
      ))}
      {atoms.length === 0 && <p>This lecture has no atoms yet. Add them with the content script.</p>}
    </main>
  );
}
