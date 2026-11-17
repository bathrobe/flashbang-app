"use client";

import { getOptionLook, type FormatOptionsProps } from "./formatProps";
import { OptionButton } from "./OptionButton";

// A statement and two choices, always True then False (the server sends them in that order).
export function TrueFalseOptions(props: FormatOptionsProps) {
  return (
    <div role="radiogroup" aria-label="True or false" className="grid grid-cols-2 gap-3">
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
