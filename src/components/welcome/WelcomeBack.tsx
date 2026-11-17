"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHud } from "@/components/hud/HudProvider";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { dismissWelcome } from "@/server/actions/dismissWelcome";
import type { WelcomeBackValues } from "@/server/queries/getWelcomeBack";

type WelcomeBackProps = WelcomeBackValues & { firstName: string };

// Shown on the day a learner comes back after a week or more away. Warm and
// short: where they are, what's new, and one button for a short session.
// No backlog total, no streak talk. Starting or dismissing hides it for today.
export function WelcomeBack({ firstName, currentLecture, publishedSince }: WelcomeBackProps) {
  const router = useRouter();
  const { learnerLevel, dueCount } = useHud();
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) return null;

  async function hideAndThen(afterwards: () => void) {
    setIsHidden(true);
    try {
      await dismissWelcome();
    } catch {
      // Hidden for this page anyway; at worst it shows once more on the next load.
    }
    afterwards();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4">
      <Panel role="region" aria-label="Welcome back" className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">Welcome back{firstName ? `, ${firstName}` : ""}.</h2>
        <p>
          {currentLecture ? `You're on Lecture ${currentLecture.number}: ${currentLecture.title}, ` : "You're "}
          at learner level <span className="font-number">{learnerLevel}</span>.
        </p>
        {publishedSince.length > 0 && (
          <p>
            New since you were last here:{" "}
            {publishedSince.map((newLecture) => `Lecture ${newLecture.number}: ${newLecture.title}`).join("; ")}.
          </p>
        )}
        {dueCount > 0 && <p>Let&apos;s ease back in with a short session.</p>}
        <div className="flex flex-wrap gap-3">
          {dueCount > 0 && (
            <Button variant="accent-1" onClick={() => hideAndThen(() => router.push("/review"))}>
              Start a short session (<span className="font-number">{dueCount}</span>)
            </Button>
          )}
          <Button onClick={() => hideAndThen(() => router.refresh())}>Not now</Button>
        </div>
      </Panel>
    </div>
  );
}
