"use client";

import { useState } from "react";
import type { OpenedDoor } from "@/server/answerTypes";
import { DoorUnveiling } from "./DoorUnveiling";

// Plays the unveiling for each door in turn (almost always just one; a linked
// atom can open a second lecture's door with the same answer), then calls
// onAllClosed. Used by the review session and the course view.
export function DoorUnveilingQueue({ doors, onAllClosed }: { doors: OpenedDoor[]; onAllClosed: () => void }) {
  const [shownCount, setShownCount] = useState(0);
  const door = doors[shownCount];
  if (!door) return null;

  function showNextOrFinish() {
    if (shownCount + 1 >= doors.length) onAllClosed();
    else setShownCount(shownCount + 1);
  }

  return <DoorUnveiling key={door.lectureId} door={door} onClose={showNextOrFinish} />;
}
