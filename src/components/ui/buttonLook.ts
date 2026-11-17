// The shared look of every button: thick outline, hard shadow, and a press
// that pushes the button into its shadow. Kept apart from Button.tsx so a
// link can look like a button too: <Link className={getButtonLook("accent-1")}>.

const lookForEveryButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-frame border-thick border-outline " +
  "px-4 py-2 font-bold shadow-hard transition-transform duration-fast " +
  "hover:-translate-x-px hover:-translate-y-px active:translate-x-1 active:translate-y-1 active:shadow-none " +
  // Disabled: its own flat fill and ink, dashed and without the shadow. Not a
  // fade: fading a coloured button dropped its text under 4.5 to 1.
  "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-disabled disabled:text-disabled-ink disabled:shadow-none";

// Full class names are spelled out because Tailwind only finds whole names in the source.
const coloursByVariant = {
  plain: "bg-panel text-ink",
  "accent-1": "bg-accent-1 text-accent-1-ink",
  "accent-2": "bg-accent-2 text-accent-2-ink",
  "accent-3": "bg-accent-3 text-accent-3-ink",
  "accent-4": "bg-accent-4 text-accent-4-ink",
};

export type ButtonVariant = keyof typeof coloursByVariant;

export function getButtonLook(variant: ButtonVariant = "plain", extraClassName = "") {
  return `${lookForEveryButton} ${coloursByVariant[variant]} ${extraClassName}`;
}
