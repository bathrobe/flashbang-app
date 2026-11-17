"use client";

import type { ReactNode } from "react";
import { HudProvider, useHud } from "@/components/hud/HudProvider";
import type { HudValues } from "@/server/queries/getHudValues";

type SampleHudValues = Partial<Omit<HudValues, "soundOn">>;

// Gives the components inside it made-up HUD numbers (clout, inbox count ...)
// without touching the real navbar's. Sound always stays what the learner set,
// so this inner provider never flips the app's sound switch.
export function SampleHud({ sampleValues, children }: { sampleValues: SampleHudValues; children: ReactNode }) {
  const { clout, learnerLevel, totalXp, dueCount, soundOn } = useHud();
  const values: HudValues = { clout, learnerLevel, totalXp, dueCount, ...sampleValues, soundOn };
  return <HudProvider valuesFromServer={values}>{children}</HudProvider>;
}
