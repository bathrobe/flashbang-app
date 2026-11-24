"use client";

import type { QuestionFormat } from "@/server/cardTypes";
import type { FormatOptionsProps } from "./formatProps";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { MultiSelectOptions } from "./MultiSelectOptions";
import { TrueFalseOptions } from "./TrueFalseOptions";

const componentByFormat = {
  multiple_choice: MultipleChoiceOptions,
  multi_select: MultiSelectOptions,
  true_false: TrueFalseOptions,
  fill_blank: MultipleChoiceOptions,
};

// Shows the options in the right component for the question's format.
export function CardOptions({ format, ...optionsProps }: FormatOptionsProps & { format: QuestionFormat }) {
  const FormatComponent = componentByFormat[format];
  return <FormatComponent {...optionsProps} />;
}
