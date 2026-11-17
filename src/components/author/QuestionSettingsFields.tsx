"use client";

import type { AtomChoice } from "@/server/queries/getAuthorLecture";
import { atomChoiceLabel } from "./atomChoiceLabel";
import { fieldLook, labelLook } from "./fieldLook";
import type { QuestionForm, QuestionFormat } from "./useQuestionForm";

type QuestionSettingsFieldsProps = {
  form: QuestionForm;
  lectureAtomChoices: AtomChoice[]; // the main atom must be in this lecture
  onFormatChange: (format: QuestionFormat) => void;
  onChange: (changes: Partial<QuestionForm>) => void;
};

// Format, main atom, and whether this is the atom's introductory question.
export function QuestionSettingsFields({ form, lectureAtomChoices, onFormatChange, onChange }: QuestionSettingsFieldsProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className={labelLook}>
        Format
        <select
          value={form.format}
          onChange={(event) => onFormatChange(event.target.value as QuestionFormat)}
          className={`${fieldLook} font-normal`}
        >
          <option value="multiple_choice">Multiple choice (3 to 5 options, one correct)</option>
          <option value="multi_select">Multi-select (4 to 6 options, one or more correct)</option>
          <option value="true_false">True/false</option>
        </select>
      </label>
      <label className={`${labelLook} min-w-64 flex-1`}>
        Main atom
        <select
          value={form.mainAtomId}
          onChange={(event) => onChange({ mainAtomId: event.target.value })}
          className={`${fieldLook} font-normal`}
        >
          {lectureAtomChoices.map((choice) => (
            <option key={choice.id} value={choice.id}>
              {atomChoiceLabel(choice)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 font-bold">
        <input
          type="checkbox"
          checked={form.isIntroductory}
          onChange={(event) => onChange({ isIntroductory: event.target.checked })}
          className="size-5"
        />
        Introductory
      </label>
    </div>
  );
}
