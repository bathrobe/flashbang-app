import { describe, expect, it } from "vitest";
import { chooseNextSessionAtoms, type WaitingAtom } from "@/game/nextSession";

const today = "2026-11-16";

function makeAtom(atomId: string, dueOn: string, position: number, retryPending = false): WaitingAtom {
  return { atomId, dueOn, retryPending, lectureNumber: 1, position };
}

const waitingAtoms = [
  makeAtom("a", "2026-11-10", 1),
  makeAtom("b", "2026-11-06", 2),
  makeAtom("c", "2026-11-08", 3),
  makeAtom("d", "2026-11-06", 4),
  makeAtom("retry", "2026-11-17", 0, true),
  makeAtom("e", "2026-11-16", 5),
];

describe("chooseNextSessionAtoms", () => {
  it("puts the most overdue first, ties in lecture order, retries last", () => {
    expect(chooseNextSessionAtoms(waitingAtoms, today, null)).toEqual({
      atomIds: ["b", "d", "c", "a", "e", "retry"],
      leftForLater: 0,
    });
  });

  it("caps the due atoms but never cuts a retry", () => {
    expect(chooseNextSessionAtoms(waitingAtoms, today, 3)).toEqual({
      atomIds: ["b", "d", "c", "retry"],
      leftForLater: 2,
    });
    expect(chooseNextSessionAtoms(waitingAtoms, today, 0)).toEqual({ atomIds: ["retry"], leftForLater: 5 });
  });

  it("orders by lecture before position when due dates match", () => {
    const atoms = [{ ...makeAtom("later", today, 1), lectureNumber: 2 }, makeAtom("earlier", today, 6)];
    expect(chooseNextSessionAtoms(atoms, today, null).atomIds).toEqual(["earlier", "later"]);
  });

  it("leaves out atoms that are neither due nor waiting for a retry", () => {
    expect(chooseNextSessionAtoms([makeAtom("future", "2026-11-20", 1)], today, null).atomIds).toEqual([]);
  });
});
