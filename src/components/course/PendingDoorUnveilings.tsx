"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OpenedDoor } from "@/server/answerTypes";
import { DoorUnveilingQueue } from "./DoorUnveilingQueue";

// On the course view: doors that opened but whose unveiling never played (the
// tab closed first, say). They play now, once; then the page reloads its data
// so the row shows the open door.
export function PendingDoorUnveilings({ doors }: { doors: OpenedDoor[] }) {
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);
  if (isFinished || doors.length === 0) return null;

  return (
    <DoorUnveilingQueue
      doors={doors}
      onAllClosed={() => {
        setIsFinished(true);
        router.refresh();
      }}
    />
  );
}
