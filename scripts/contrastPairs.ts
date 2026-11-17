// Every text-on-fill pair the components really draw, found by reading them.
// `text` and `fill` are token names from the theme file (without "--color-").
// `fadedTo` is for a whole element drawn at an opacity over `fadedOver`
// (the retired atom on the author page). Update this list when a component
// starts drawing text on a new fill.

export type ContrastPair = {
  name: string;
  usedIn: string;
  text: string;
  fill: string;
  fadedTo?: number;
  fadedOver?: string;
};

const levelPairs: ContrastPair[] = [1, 2, 3, 4, 5].map((level) => ({
  name: `Level ${level}${level === 5 ? "+" : ""} look`,
  usedIn: "AtomToken, XpBar badge, LevelUpCallout, SessionMap",
  text: `level-${level}-ink`,
  fill: `level-${level}-fill`,
}));

export const contrastPairs: ContrastPair[] = [
  { name: "Body text on page", usedIn: "layout.tsx, page headings", text: "ink", fill: "page" },
  { name: "Body text on panel", usedIn: "Panel, Navbar, fields", text: "ink", fill: "panel" },
  { name: "Muted text on page", usedIn: 'LectureRow draft ("Not yet unlocked"), page captions', text: "ink-muted", fill: "page" },
  { name: "Muted text on panel", usedIn: "hints, StakeLine, BeginReview, AtomToken popover", text: "ink-muted", fill: "panel" },
  { name: "Disabled button (any variant)", usedIn: "buttonLook disabled:", text: "disabled-ink", fill: "disabled" },

  { name: "Option: resting", usedIn: "OptionButton", text: "ink", fill: "panel" },
  { name: "Option: hovered", usedIn: "OptionButton", text: "accent-2-ink", fill: "accent-2" },
  { name: "Option: chosen", usedIn: "OptionButton", text: "accent-4-ink", fill: "accent-4" },
  { name: "Option: correct", usedIn: "OptionButton, FeedbackPanel banner", text: "correct-ink", fill: "correct" },
  { name: "Option: wrong", usedIn: "OptionButton, FeedbackPanel banner, CloutChange wipe", text: "wrong-ink", fill: "wrong" },
  { name: "Option: missed", usedIn: "OptionButton", text: "missed-ink", fill: "missed" },

  { name: "Accent 1 button", usedIn: "Continue, Confirm, Begin review, inbox badge", text: "accent-1-ink", fill: "accent-1" },
  { name: "Accent 2 button", usedIn: '"New" label, learner level-up', text: "accent-2-ink", fill: "accent-2" },
  { name: "Accent 3 button", usedIn: "Save, Start lecture", text: "accent-3-ink", fill: "accent-3" },
  { name: "Accent 4 button", usedIn: "avatar initial", text: "accent-4-ink", fill: "accent-4" },

  { name: "XP number on panel", usedIn: "Navbar level, AtomToken popover, SpoilRow", text: "xp", fill: "panel" },
  { name: "Clout number on panel", usedIn: "Navbar, StakeLine, CloutChange, SessionTotals", text: "clout", fill: "panel" },

  ...levelPairs,

  { name: "Door: words behind the open door", usedIn: "DoorUnveiling", text: "ink", fill: "door-light" },

  {
    name: "Retired atom (author, faded) on page",
    usedIn: "AtomEditor",
    text: "ink",
    fill: "page",
    fadedTo: 0.6,
    fadedOver: "page",
  },
  {
    name: "Retired atom field (author, faded)",
    usedIn: "AtomEditor > fieldLook",
    text: "ink",
    fill: "panel",
    fadedTo: 0.6,
    fadedOver: "page",
  },
];
