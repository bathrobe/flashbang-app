"use client";

import { useState } from "react";
import type { ConfidenceStep } from "@/game/settings";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import type { ShowableCard } from "@/server/cardTypes";
import { ConfidenceSlider } from "./ConfidenceSlider";
import { CardOptions } from "./formats/CardOptions";
import { StakeLine } from "./StakeLine";

export type CardAnswer = { chosenOptionIds: string[]; confidenceStep: ConfidenceStep };

type ReviewCardProps = {
  card: ShowableCard;
  onConfirm: (answer: CardAnswer) => void;
  isLocked: boolean; // true once the answer has been submitted
};

// One question. The session gives each showing its own `key`, so a new card
// always starts with nothing chosen and the slider at Hunch.
// The atom the question tests is never named here: that would give it away.
export function ReviewCard({ card, onConfirm, isLocked }: ReviewCardProps) {
  const [chosenOptionIds, setChosenOptionIds] = useState<string[]>([]);
  const [confidenceStep, setConfidenceStep] = useState<ConfidenceStep>("hunch");

  return (
    <Panel className="flex flex-col gap-4">
      {card.isNew && (
        <p className="w-fit border-thick border-outline bg-accent-2 px-2 font-display text-accent-2-ink">New</p>
      )}

      {/* IMAGE SLOT (checklist item 20): <QuestionImage image={card.image} /> goes here; nothing for now. */}

      <h1 className="text-xl font-bold">{card.prompt}</h1>

      <CardOptions
        format={card.format}
        options={card.options}
        chosenOptionIds={chosenOptionIds}
        onChange={setChosenOptionIds}
        isLocked={isLocked}
      />

      <div>
        <ConfidenceSlider confidenceStep={confidenceStep} onChange={setConfidenceStep} isLocked={isLocked} />
        <StakeLine confidenceStep={confidenceStep} cardKind={card.kind} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="accent-1"
          disabled={chosenOptionIds.length === 0 || isLocked}
          onClick={() => onConfirm({ chosenOptionIds, confidenceStep })}
        >
          Confirm
        </Button>
        {/* FLAG SLOT (checklist item 16): <FlagControl questionId={card.questionId} /> goes here. */}
      </div>
    </Panel>
  );
}
