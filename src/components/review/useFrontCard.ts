"use client";

import { useEffect, useState } from "react";
import { loadCard } from "@/server/actions/loadCard";
import type { ShowableCard } from "@/server/cardTypes";

// The card for the atom at the front of the queue, loaded from the server.
// `showingNumber` goes up every time the session moves on (or retries a failed
// load), so the same atom coming round again still gets a fresh load.

type FrontCard =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "showing"; card: ShowableCard; attemptId: string };

type LoadedCard = { showingNumber: number } & ({ status: "failed" } | { status: "showing"; card: ShowableCard; attemptId: string });

export function useFrontCard(frontAtomId: string | undefined, showingNumber: number, skipFrontAtom: () => void): FrontCard {
  const [loadedCard, setLoadedCard] = useState<LoadedCard | null>(null);

  useEffect(() => {
    if (!frontAtomId) return;
    let isStale = false; // set when the session moves on before this load returns

    loadCard(frontAtomId)
      .then((result) => {
        if (isStale) return;
        // Not due any more (answered in another tab) or no question left: skip it.
        if (result.kind === "not_due" || result.kind === "no_questions") return skipFrontAtom();
        // A fresh attemptId per showing lets submitAnswer ignore a double submit.
        setLoadedCard({ showingNumber, status: "showing", card: result, attemptId: crypto.randomUUID() });
      })
      .catch(() => {
        if (!isStale) setLoadedCard({ showingNumber, status: "failed" });
      });

    return () => {
      isStale = true;
    };
    // skipFrontAtom is left out on purpose: it is a new function on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontAtomId, showingNumber]);

  // A result from an earlier showing means this one is still loading.
  if (!loadedCard || loadedCard.showingNumber !== showingNumber) return { status: "loading" };
  return loadedCard;
}
