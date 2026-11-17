"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { getButtonLook } from "@/components/ui/buttonLook";
import { Panel } from "@/components/ui/Panel";
import { startLecture } from "@/server/actions/startLecture";
import { AtomList } from "./AtomList";

type StartLectureStepsProps = {
  lectureId: string;
  lectureNumber: number;
  lectureTitle: string;
  courseSlug: string;
  atoms: { atomId: string; sentence: string }[];
};

// Two steps in one component: first the listen check, then the atom list with
// "Begin". Nothing is saved until "Begin", so "Not yet" leaves the inbox alone.
export function StartLectureSteps({ lectureId, lectureNumber, lectureTitle, courseSlug, atoms }: StartLectureStepsProps) {
  const [step, setStep] = useState<"listen_check" | "atom_list">("listen_check");
  const [isStarting, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function begin() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        // On success the action redirects to /review, so a returned value means it was refused.
        const result = await startLecture(lectureId);
        if (result?.message) setErrorMessage(result.message);
      } catch {
        setErrorMessage("Couldn't start the lecture. Try again.");
      }
    });
  }

  if (step === "listen_check") {
    return (
      <Panel>
        <p className="text-ink-muted">Lecture {lectureNumber}: {lectureTitle}</p>
        <h1 className="mt-1 font-display text-2xl">Have you finished Lecture {lectureNumber}?</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="accent-3" onClick={() => setStep("atom_list")}>
            Yes
          </Button>
          <Link href={`/courses/${courseSlug}?comeBack=1`} className={getButtonLook("plain")}>
            Not yet
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      {/* STAGE 2: the intake replaces AtomList; the listen check and "Begin" stay. */}
      <AtomList lectureNumber={lectureNumber} atoms={atoms} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="accent-1" onClick={begin} disabled={isStarting}>
          {isStarting ? "Starting…" : "Begin"}
        </Button>
        {errorMessage && (
          <p role="alert" className="font-bold">
            {errorMessage}
          </p>
        )}
      </div>
    </Panel>
  );
}
