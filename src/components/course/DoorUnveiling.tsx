"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { playSound } from "@/lib/sound";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { markDoorUnveiled } from "@/server/actions/markDoorUnveiled";
import type { OpenedDoor } from "@/server/answerTypes";

// The trial door's unveiling: a full-screen overlay where the door swings open
// to show "Coming soon.", with its own sound, once. Under reduced motion it is
// a still panel with the door already open. Close (or Escape) dismisses it.
// When it finishes or is closed, markDoorUnveiled records it so it never plays again.
export function DoorUnveiling({ door, onClose }: { door: OpenedDoor; onClose: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();

  // Refs stop a second play or save when React runs effects twice in development.
  const soundPlayed = useRef(false);
  const savedAsUnveiled = useRef(false);

  function markUnveiledOnce() {
    if (savedAsUnveiled.current) return;
    savedAsUnveiled.current = true;
    // If saving fails, the unveiling simply plays again on the next course-view visit.
    markDoorUnveiled(door.lectureId).catch(() => {});
  }

  function close() {
    markUnveiledOnce();
    onClose();
  }

  useEffect(() => {
    if (soundPlayed.current) return;
    soundPlayed.current = true;
    playSound("door-unveil");
  }, []);

  // A still panel has nothing to wait for: once shown, it has finished.
  useEffect(() => {
    if (prefersReducedMotion) markUnveiledOnce();
  });

  // No dependency list: re-attached each render so it always calls the latest `close`.
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-door-unveiling={door.lectureId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
    >
      <Panel className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <h2 id={titleId} className="font-display text-2xl">
          The Lecture {door.lectureNumber} trial door is open
        </h2>

        {/* The doorway: light behind, the words in it, and the leaf swinging away on its hinge. */}
        <div className="relative h-48 w-28 border-thick border-door-edge bg-door-light">
          <p
            className={`absolute inset-0 flex items-center justify-center font-display text-ink ${
              prefersReducedMotion ? "" : "animate-door-reveal"
            }`}
          >
            Coming soon.
          </p>
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="absolute inset-0 origin-left animate-door-swing border-thick border-door-edge bg-door-fill"
              onAnimationEnd={markUnveiledOnce}
            />
          )}
        </div>

        <Button variant="accent-1" onClick={close} autoFocus>
          Close
        </Button>
      </Panel>
    </div>
  );
}
