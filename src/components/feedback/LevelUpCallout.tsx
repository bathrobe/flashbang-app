import { getAtomTokenLook } from "@/components/course/atomTokenLook";

type LevelUpCalloutProps =
  | { kind: "atom"; level: number; sentence: string }
  | { kind: "learner"; level: number };

// "Level up!" for one atom (in its new level's look) or for the learner.
// One callout per atom that levelled, plus one if the learner level rose.
export function LevelUpCallout(props: LevelUpCalloutProps) {
  const look = props.kind === "atom" ? getAtomTokenLook(props.level) : "bg-accent-2 border-outline text-accent-2-ink";
  return (
    <p role="status" className={`w-fit border-thick px-2 py-1 font-display shadow-hard ${look}`} data-level-up={props.kind}>
      {props.kind === "atom" ? `Level up! This idea is now Level ${props.level}.` : `You reached Level ${props.level}!`}
    </p>
  );
}
