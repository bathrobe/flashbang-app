import { LectureRow } from "@/components/course/LectureRow";
import { Button } from "@/components/ui/Button";
import type { ButtonVariant } from "@/components/ui/buttonLook";
import { Panel } from "@/components/ui/Panel";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";

const buttonVariants: ButtonVariant[] = ["plain", "accent-1", "accent-2", "accent-3", "accent-4"];

const draftLecture = {
  lectureId: "sample-draft",
  number: 2,
  title: "The Reforms of Solon",
  state: "draft" as const,
  atoms: [],
  dueCount: 0,
  door: null,
};

// Buttons in every variant, ready and disabled; a plain panel; and a greyed
// "not yet unlocked" lecture row (muted text must still be readable).
export function ButtonsSection() {
  return (
    <PlaygroundSection title="Buttons, panel, greyed text" group="buttons">
      <div className="flex flex-wrap gap-3" data-buttons="enabled">
        {buttonVariants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <SampleLabel>disabled</SampleLabel>
      <div className="flex flex-wrap gap-3" data-buttons="disabled">
        {buttonVariants.map((variant) => (
          <Button key={variant} variant={variant} disabled>
            {variant}
          </Button>
        ))}
      </div>
      <Panel data-playground="panel">
        <p className="font-display">A panel</p>
        <p>Body text on the panel.</p>
        <p className="text-ink-muted">Muted text on the panel.</p>
      </Panel>
      <div data-playground="draft-lecture">
        <LectureRow lecture={draftLecture} courseSlug="sample" />
      </div>
    </PlaygroundSection>
  );
}
