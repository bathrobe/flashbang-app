import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionMap } from "@/components/end/SessionMap";
import { SessionTotals } from "@/components/end/SessionTotals";
import { SpoilsList } from "@/components/end/SpoilsList";
import { getButtonLook } from "@/components/ui/buttonLook";
import { Panel } from "@/components/ui/Panel";
import { requireLearner } from "@/server/access";
import { getTodaySummary } from "@/server/queries/getTodaySummary";

// The end screen: everything collected today, added up from today's answers,
// so a session left and resumed is covered in full. Nothing answered today
// means there is nothing to show, so it goes back to the courses.
export default async function ReviewDonePage() {
  const user = await requireLearner();
  const summary = await getTodaySummary(user.id);
  if (!summary) redirect("/courses");

  const backHref = summary.courseSlug ? `/courses/${summary.courseSlug}` : "/courses";

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <h1 className="font-display text-3xl">Today&apos;s haul</h1>
      <Panel>
        <SpoilsList reviewedAtoms={summary.reviewedAtoms} linkedOnlyAtoms={summary.linkedOnlyAtoms} />
      </Panel>
      <Panel>
        <SessionTotals
          today={summary.today}
          atomLevelUps={summary.atomLevelUps}
          learnerLevelUp={summary.learnerLevelUp}
          clout={summary.clout}
          doorProgress={summary.doorProgress}
          nextDueDate={summary.nextDueDate}
        />
      </Panel>
      <Panel>
        <SessionMap map={summary.map} />
      </Panel>
      <Link href={backHref} className={getButtonLook("accent-1", "self-start")}>
        Back to the course
      </Link>
    </main>
  );
}
