"use client";

import { useState, type ReactNode } from "react";
import type { ConfidenceStep } from "@/game/settings";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import type { ShowableCard } from "@/server/cardTypes";
import { ConfidenceSlider } from "./ConfidenceSlider";
import { QuestionImage } from "./QuestionImage";
import { CardOptions } from "./formats/CardOptions";
import type { OptionLook } from "./formats/OptionButton";
import { StakeLine } from "./StakeLine";

export type CardAnswer = { chosenOptionIds: string[]; confidenceStep: ConfidenceStep };

type ReviewCardProps = {
  card: ShowableCard;
  onConfirm: (answer: CardAnswer) => void;
  isLocked: boolean; // true from the moment Confirm is pressed: the answer can't change
  isSaving?: boolean; // waiting for the server: Confirm shows a busy state
  lookByOptionId?: Record<string, OptionLook>; // after grading: correct, wrong, missed
  afterAnswer?: ReactNode; // the result (or a save error), shown in place of Confirm
  flagControl?: ReactNode; // beside Confirm, before answering
};

// One question. The session gives each showing its own `key`, so a new card
// always starts with nothing chosen and the slider at Hunch.
// The atom the question tests is never named here: that would give it away.
export function ReviewCard({ card, onConfirm, isLocked, isSaving = false, lookByOptionId, afterAnswer, flagControl }: ReviewCardProps) {
  const [chosenOptionIds, setChosenOptionIds] = useState<string[]>([]);
  const [confidenceStep, setConfidenceStep] = useState<ConfidenceStep>("hunch");

  return (
    <Panel className="flex flex-col gap-4">
      {card.isNew && (
        <p className="w-fit border-thick border-outline bg-accent-2 px-2 font-display text-accent-2-ink">New</p>
      )}

      <QuestionImage image={card.image} />

      <h1 className="text-xl font-bold">{card.prompt}</h1>

      <CardOptions
        format={card.format}
        options={card.options}
        chosenOptionIds={chosenOptionIds}
        onChange={setChosenOptionIds}
        isLocked={isLocked}
        lookByOptionId={lookByOptionId}
      />

      <div>
        <ConfidenceSlider confidenceStep={confidenceStep} onChange={setConfidenceStep} isLocked={isLocked} />
        <StakeLine confidenceStep={confidenceStep} cardKind={card.kind} />
      </div>

      {afterAnswer ?? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="accent-1"
            disabled={chosenOptionIds.length === 0 || isLocked}
            aria-busy={isSaving}
            onClick={() => onConfirm({ chosenOptionIds, confidenceStep })}
          >
            {isSaving ? "Saving…" : "Confirm"}
          </Button>
          {flagControl}
        </div>
      )}
    </Panel>
  );
}
