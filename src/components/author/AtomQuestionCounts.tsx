import type { AuthorQuestion } from "@/server/queries/getAuthorLecture";

const formatNames = { multiple_choice: "multiple choice", multi_select: "multi-select", true_false: "true/false" };
const fewestUsableQuestions = 3;

// How many questions the atom has, by format, and the two warnings. "Usable"
// means draft or active: before publishing every question is a draft, and
// publishing turns drafts active. Flagged ones are out of rotation, so they
// do not count.
export function AtomQuestionCounts({ questions }: { questions: AuthorQuestion[] }) {
  const usableQuestions = questions.filter((question) => question.status === "draft" || question.status === "active");
  const formatCounts = Object.entries(formatNames).map(
    ([format, name]) => `${questions.filter((question) => question.format === format).length} ${name}`,
  );
  const hasIntroductory = usableQuestions.some((question) => question.isIntroductory);

  return (
    <div>
      <p>
        {questions.length} questions ({usableQuestions.length} usable): {formatCounts.join(", ")}
      </p>
      {!hasIntroductory && <p className="font-bold">Warning: no introductory question.</p>}
      {usableQuestions.length < fewestUsableQuestions && (
        <p className="font-bold">Warning: fewer than {fewestUsableQuestions} usable questions.</p>
      )}
    </div>
  );
}
