"use client";

import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { saveQuestion } from "@/server/actions/author/saveQuestion";
import type { AtomChoice, AuthorQuestion } from "@/server/queries/getAuthorLecture";
import { fieldLook, labelLook } from "./fieldLook";
import { LinkedAtomsEditor } from "./LinkedAtomsEditor";
import { OptionListEditor } from "./OptionListEditor";
import { QuestionImageFields } from "./QuestionImageFields";
import { QuestionSettingsFields } from "./QuestionSettingsFields";
import { QuestionStatusButtons } from "./QuestionStatusButtons";
import { SaveStatus } from "./SaveStatus";
import { useAuthorAction } from "./useAuthorAction";
import { fieldsFromForm, useQuestionForm } from "./useQuestionForm";

type QuestionEditorProps = {
  question: AuthorQuestion;
  lectureAtomChoices: AtomChoice[];
  allAtomChoices: AtomChoice[];
};

// Every field of one question, with ONE Save. A shape error refuses the save
// and says why; lint warnings (from the last save) show here and never block.
export function QuestionEditor({ question, lectureAtomChoices, allAtomChoices }: QuestionEditorProps) {
  const { form, updateForm, changeFormat } = useQuestionForm(question);
  const { saveState, runAction, isBusy } = useAuthorAction();
  const save = () => runAction(() => saveQuestion({ questionId: question.id, fields: fieldsFromForm(form) }));

  return (
    <Panel className="flex flex-col gap-3">
      <QuestionStatusButtons question={question} />
      <label className={labelLook}>
        Prompt
        <textarea
          value={form.prompt}
          onChange={(event) => updateForm({ prompt: event.target.value })}
          rows={2}
          className={`${fieldLook} font-normal`}
        />
      </label>
      <QuestionSettingsFields
        form={form}
        lectureAtomChoices={lectureAtomChoices}
        onFormatChange={changeFormat}
        onChange={updateForm}
      />
      <OptionListEditor format={form.format} options={form.options} onChange={(options) => updateForm({ options })} />
      <label className={labelLook}>
        Explanation
        <textarea
          value={form.explanation}
          onChange={(event) => updateForm({ explanation: event.target.value })}
          rows={3}
          className={`${fieldLook} font-normal`}
        />
      </label>
      <LinkedAtomsEditor
        linkedAtoms={form.linkedAtoms}
        mainAtomId={form.mainAtomId}
        atomChoices={allAtomChoices}
        onChange={(linkedAtoms) => updateForm({ linkedAtoms })}
      />
      <QuestionImageFields form={form} onChange={updateForm} />
      {question.lintWarnings.length > 0 && (
        <ul className="list-disc pl-5" aria-label="Lint warnings">
          {question.lintWarnings.map((warning) => (
            <li key={warning}>Warning: {warning}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="accent-3" onClick={save} disabled={isBusy}>
          Save question
        </Button>
        <SaveStatus saveState={saveState} />
      </div>
    </Panel>
  );
}
