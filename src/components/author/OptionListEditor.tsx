"use client";

import { Button } from "@/components/ui/Button";
import { fieldLook } from "./fieldLook";
import type { FormOption, QuestionFormat } from "./useQuestionForm";

type OptionListEditorProps = {
  format: QuestionFormat;
  options: FormOption[];
  onChange: (options: FormOption[]) => void;
};

// Each option's text and whether it is correct, with add and remove. True/false
// options are fixed ("True", "False"); only which one is correct can change.
export function OptionListEditor({ format, options, onChange }: OptionListEditorProps) {
  const isTrueFalse = format === "true_false";
  const changeOption = (index: number, changes: Partial<FormOption>) =>
    onChange(options.map((option, optionIndex) => (optionIndex === index ? { ...option, ...changes } : option)));
  // A new option gets a fresh id; an existing option's id never changes (answers are stored by it).
  const addOption = () => onChange([...options, { id: crypto.randomUUID().slice(0, 8), text: "", isCorrect: false }]);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-bold">Options (tick the correct ones)</legend>
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={option.isCorrect}
            onChange={(event) => changeOption(index, { isCorrect: event.target.checked })}
            aria-label={`Option ${index + 1} is correct`}
            className="size-5"
          />
          <input
            value={option.text}
            onChange={(event) => changeOption(index, { text: event.target.value })}
            readOnly={isTrueFalse}
            aria-label={`Option ${index + 1} text`}
            className={fieldLook}
          />
          {!isTrueFalse && (
            <Button onClick={() => onChange(options.filter((_, optionIndex) => optionIndex !== index))}>
              Remove
            </Button>
          )}
        </div>
      ))}
      {!isTrueFalse && (
        <div>
          <Button onClick={addOption}>Add option</Button>
        </div>
      )}
    </fieldset>
  );
}
