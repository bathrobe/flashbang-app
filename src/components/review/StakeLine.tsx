"use client";

import { getCloutStakes } from "@/game/clout";
import type { ConfidenceStep } from "@/game/settings";
import { useHud } from "@/components/hud/HudProvider";

type StakeLineProps = { confidenceStep: ConfidenceStep; cardKind: "first" | "retry" };

// Under the slider: what the current step would win and lose at the current
// clout. Worked out in the browser with the same rule the server scores with.
export function StakeLine({ confidenceStep, cardKind }: StakeLineProps) {
  const { clout } = useHud();

  // Retries never change clout (spec: Clout).
  if (cardKind === "retry") {
    return <p className="mt-2 text-ink-muted">A retry: no clout at stake.</p>;
  }

  const { gainIfCorrect, lossIfWrong } = getCloutStakes(confidenceStep, clout);
  return (
    <p className="mt-2">
      Right: <span className="font-number text-clout">+{gainIfCorrect}</span> clout
      <span className="mx-2 text-ink-muted">·</span>
      Wrong: {lossIfWrong === 0 ? "no loss" : <><span className="font-number text-clout">−{lossIfWrong}</span> clout</>}
    </p>
  );
}
