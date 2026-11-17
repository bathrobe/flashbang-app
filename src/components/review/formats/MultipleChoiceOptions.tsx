"use client";

import { getOptionLook, type FormatOptionsProps } from "./formatProps";
import { OptionButton } from "./OptionButton";

// Several options, exactly one correct. Choosing one replaces any earlier choice.
export function MultipleChoiceOptions(props: FormatOptionsProps) {
  return (
    <div role="radiogroup" aria-label="Answer options" className="flex flex-col gap-3">
      {props.options.map((option) => (
        <OptionButton
          key={option.id}
          text={option.text}
          look={getOptionLook(option.id, props)}
          isChosen={props.chosenOptionIds.includes(option.id)}
          selectionRole="radio"
          isLocked={props.isLocked}
          onClick={() => props.onChange([option.id])}
        />
      ))}
    </div>
  );
}
