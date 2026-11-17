import type { CardOption } from "@/server/cardTypes";
import type { OptionLook } from "./OptionButton";

// What every format component takes. `lookByOptionId` is set only after an
// answer is graded (feedback); before that each option is resting or chosen.
export type FormatOptionsProps = {
  options: CardOption[];
  chosenOptionIds: string[];
  onChange: (chosenOptionIds: string[]) => void;
  isLocked: boolean;
  lookByOptionId?: Record<string, OptionLook>;
};

export function getOptionLook(optionId: string, props: FormatOptionsProps): OptionLook {
  const gradedLook = props.lookByOptionId?.[optionId];
  if (gradedLook) return gradedLook;
  return props.chosenOptionIds.includes(optionId) ? "chosen" : "resting";
}
