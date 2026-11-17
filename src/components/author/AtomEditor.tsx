import { Panel } from "@/components/ui/Panel";
import type { AtomChoice, AuthorAtom, AuthorQuestion } from "@/server/queries/getAuthorLecture";
import { AtomButtons } from "./AtomButtons";
import { AtomQuestionCounts } from "./AtomQuestionCounts";
import { AtomSentenceForm } from "./AtomSentenceForm";
import { QuestionEditor } from "./QuestionEditor";

type AtomEditorProps = {
  atom: AuthorAtom;
  questions: AuthorQuestion[]; // this atom's questions, deleted ones already left out
  lectureAtomChoices: AtomChoice[]; // possible main atoms
  allAtomChoices: AtomChoice[]; // possible linked atoms
};

// One atom: its sentence, question counts and warnings, its buttons, and its
// questions beneath.
export function AtomEditor({ atom, questions, lectureAtomChoices, allAtomChoices }: AtomEditorProps) {
  return (
    // A retired atom is greyed: it is out of every learner's sessions, but its XP stays.
    <section className={`flex flex-col gap-3 ${atom.status === "retired" ? "opacity-60" : ""}`}>
      <Panel className="flex flex-col gap-3">
        <h2 className="font-display text-xl">
          Atom {atom.position}
          {atom.status === "retired" && <span className="text-ink-muted"> (retired)</span>}
        </h2>
        <AtomSentenceForm atomId={atom.id} savedSentence={atom.sentence} />
        <AtomQuestionCounts questions={questions} />
        <AtomButtons atom={atom} />
      </Panel>
      <ol className="flex flex-col gap-3 pl-4">
        {questions.map((question) => (
          <li key={question.id} id={`question-${question.id}`}>
            <QuestionEditor
              question={question}
              lectureAtomChoices={lectureAtomChoices}
              allAtomChoices={allAtomChoices}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
