"use client";

import { getOptionLook, type FormatOptionsProps } from "./formatProps";
import { OptionButton } from "./OptionButton";

// Several options, one or more correct. Each click toggles one option.
// Right only if the chosen set matches exactly (graded on the server).
export function MultiSelectOptions(props: FormatOptionsProps) {
  function toggle(optionId: string) {
    const isChosen = props.chosenOptionIds.includes(optionId);
    props.onChange(
      isChosen ? props.chosenOptionIds.filter((chosenId) => chosenId !== optionId) : [...props.chosenOptionIds, optionId],
    );
  }

  return (
    <div>
      <p id="multi-select-hint" className="mb-2 text-ink-muted">
        More than one may be correct.
      </p>
      <div role="group" aria-describedby="multi-select-hint" className="flex flex-col gap-3">
        {props.options.map((option) => (
          <OptionButton
            key={option.id}
            text={option.text}
            look={getOptionLook(option.id, props)}
            isChosen={props.chosenOptionIds.includes(option.id)}
            selectionRole="checkbox"
            isLocked={props.isLocked}
            onClick={() => toggle(option.id)}
          />
        ))}
      </div>
    </div>
  );
}
