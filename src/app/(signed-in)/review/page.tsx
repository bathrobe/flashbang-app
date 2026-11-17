import { redirect } from "next/navigation";
import { ReviewSession } from "@/components/review/ReviewSession";
import { requireLearner } from "@/server/access";
import { getSessionQueue } from "@/server/queries/getSessionQueue";

// One review session. The server sends only the atom ids, in order; each
// card's question is loaded one at a time by the session component.
export default async function ReviewPage({ searchParams }: PageProps<"/review">) {
  const { all } = await searchParams; // searchParams is a promise in Next.js 16
  const user = await requireLearner();
  const atomIds = await getSessionQueue(user.id, { all: all === "1" });

  // Nothing to review: back to the courses view, which says when the next review is.
  if (atomIds.length === 0) redirect("/courses");

  return (
    <main className="mx-auto max-w-2xl p-4">
      <ReviewSession atomIds={atomIds} />
    </main>
  );
}
