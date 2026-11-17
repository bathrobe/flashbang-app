"use client";

import { TrialDoor } from "@/components/course/TrialDoor";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";

const lockedDoor = { doorLevel: 3, atomsAtDoorLevel: 4, atomCount: 7, isOpen: false, isUnveiled: false };
const openDoor = { doorLevel: 3, atomsAtDoorLevel: 7, atomCount: 7, isOpen: true, isUnveiled: true };

// The trial door locked (requirement and progress) and open (click: "Coming soon.").
export function DoorSection() {
  return (
    <PlaygroundSection title="Trial door" group="door">
      <div className="flex flex-wrap gap-8">
        <div>
          <SampleLabel>locked</SampleLabel>
          <TrialDoor door={lockedDoor} />
        </div>
        <div>
          <SampleLabel>open</SampleLabel>
          <TrialDoor door={openDoor} />
        </div>
      </div>
    </PlaygroundSection>
  );
}
