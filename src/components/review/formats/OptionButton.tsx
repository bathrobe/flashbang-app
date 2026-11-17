"use client";

// One answer option. Its look is one of the states below; "hovered" is what
// a resting option turns into under the pointer (set directly only by the
// theme playground, to show it without a pointer). The last three are shown after an answer is
// graded (feedback, checklist item 12): "missed" marks a correct option the
// learner did not choose on a multi-select. Every fill/ink pair in the theme
// file reaches 4.5 to 1.
export type OptionLook = "resting" | "hovered" | "chosen" | "correct" | "wrong" | "missed";

// Full class names are spelled out because Tailwind only finds whole names in the source.
const coloursByLook: Record<OptionLook, string> = {
  resting: "bg-panel text-ink",
  hovered: "bg-accent-2 text-accent-2-ink",
  chosen: "bg-accent-4 text-accent-4-ink",
  correct: "bg-correct text-correct-ink",
  wrong: "bg-wrong text-wrong-ink",
  missed: "bg-missed text-missed-ink",
};

// Read out by screen readers, so the state is not carried by colour alone.
const spokenStateByLook: Record<OptionLook, string> = {
  resting: "",
  hovered: "",
  chosen: "",
  correct: " (correct)",
  wrong: " (wrong)",
  missed: " (missed: this one was correct)",
};

// A visible mark too, so a graded option never relies on colour alone.
const visibleMarkByLook: Record<OptionLook, string> = { resting: "", hovered: "", chosen: "", correct: "✓", wrong: "✗", missed: "missed" };

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
      {visibleMarkByLook[look] && (
        <span aria-hidden="true" className="float-right ml-2 font-number">
          {visibleMarkByLook[look]}
        </span>
      )}
      {text}
      <span className="sr-only">{spokenStateByLook[look]}</span>
    </button>
  );
}
