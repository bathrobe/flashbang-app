"use client";

// One answer option. Its look is one of the states below; "hovered" is the
// resting look under the pointer. The last three are shown after an answer is
// graded (feedback, checklist item 12): "missed" marks a correct option the
// learner did not choose on a multi-select. Every fill/ink pair in the theme
// file reaches 4.5 to 1.
export type OptionLook = "resting" | "chosen" | "correct" | "wrong" | "missed";

// Full class names are spelled out because Tailwind only finds whole names in the source.
const coloursByLook: Record<OptionLook, string> = {
  resting: "bg-panel text-ink",
  chosen: "bg-accent-4 text-accent-4-ink",
  correct: "bg-correct text-correct-ink",
  wrong: "bg-wrong text-wrong-ink",
  missed: "bg-missed text-missed-ink",
};

// Read out by screen readers, so the state is not carried by colour alone.
const spokenStateByLook: Record<OptionLook, string> = {
  resting: "",
  chosen: "",
  correct: " (correct)",
  wrong: " (wrong)",
  missed: " (missed: this one was correct)",
};

const hoverLook = "cursor-pointer hover:bg-accent-2 hover:text-accent-2-ink";

type OptionButtonProps = {
  text: string;
  look: OptionLook;
  isChosen: boolean; // for screen readers: is this option selected?
  selectionRole: "radio" | "checkbox"; // one answer (radio) or several (checkbox)
  isLocked: boolean; // after submitting: no more changes
  onClick: () => void;
};

export function OptionButton({ text, look, isChosen, selectionRole, isLocked, onClick }: OptionButtonProps) {
  const canHover = look === "resting" && !isLocked;
  return (
    <button
      type="button"
      role={selectionRole}
      aria-checked={isChosen}
      disabled={isLocked}
      onClick={onClick}
      className={
        "w-full rounded-frame border-thick border-outline px-4 py-3 text-left font-bold shadow-hard " +
        "transition-colors duration-fast focus-visible:outline-3 focus-visible:outline-offset-2 " +
        `focus-visible:outline-outline disabled:cursor-default ${coloursByLook[look]} ${canHover ? hoverLook : ""}`
      }
    >
      {text}
      <span className="sr-only">{spokenStateByLook[look]}</span>
    </button>
  );
}
