import type { AuthorQuestion } from "@/server/queries/getAuthorLecture";
import { UnflagButton } from "./UnflagButton";

// Flagged questions first, with the learner's note. Each links down to its
// full editor under its atom, and can be unflagged from here.
export function FlaggedList({ questions }: { questions: AuthorQuestion[] }) {
  return (
    <section>
      <h2 className="font-display text-xl">Flagged ({questions.length})</h2>
      {questions.length === 0 && <p className="text-ink-muted">No flagged questions.</p>}
      <ul className="flex flex-col gap-3">
        {questions.map((question) => (
          <li key={question.id} className="border-thick border-outline p-2">
            <a href={`#question-${question.id}`} className="font-bold underline">
              {question.prompt || "(no prompt yet)"}
            </a>
            <p>Note: {question.flagNote || <span className="text-ink-muted">(no note)</span>}</p>
            <UnflagButton questionId={question.id} />
          </li>
        ))}
      </ul>
    </section>
  );
}
