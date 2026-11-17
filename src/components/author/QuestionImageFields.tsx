"use client";

import { fieldLook, labelLook } from "./fieldLook";
import type { QuestionForm } from "./useQuestionForm";

type QuestionImageFieldsProps = {
  form: QuestionForm;
  onChange: (changes: Partial<QuestionForm>) => void;
};

// The image's path (a file in public/question-images/), credit and kind.
// Adding the file itself is a commit and a deploy.
export function QuestionImageFields({ form, onChange }: QuestionImageFieldsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <label className={labelLook}>
        Image path
        <input
          value={form.imagePath}
          onChange={(event) => onChange({ imagePath: event.target.value })}
          placeholder="/question-images/…"
          className={`${fieldLook} font-normal`}
        />
      </label>
      <label className={labelLook}>
        Image credit
        <input
          value={form.imageCredit}
          onChange={(event) => onChange({ imageCredit: event.target.value })}
          className={`${fieldLook} font-normal`}
        />
      </label>
      <label className={labelLook}>
        Image kind
        <select
          value={form.imageKind}
          onChange={(event) => onChange({ imageKind: event.target.value as QuestionForm["imageKind"] })}
          className={`${fieldLook} font-normal`}
        >
          <option value="">(none)</option>
          <option value="sourced">sourced</option>
          <option value="generated">generated</option>
        </select>
      </label>
    </div>
  );
}
