import { describe, expect, it } from "vitest";
import { findSessionMapEdges } from "@/game/sessionMapEdges";

describe("findSessionMapEdges", () => {
  it("joins main and linked atoms, and two linked atoms, once per pair, only among today's atoms", () => {
    const edges = findSessionMapEdges(
      ["a", "b", "c"],
      [
        { mainAtomId: "a", linkedAtomIds: ["b"] },
        { mainAtomId: "b", linkedAtomIds: ["a"] },
        { mainAtomId: "x", linkedAtomIds: ["c", "b"] },
        { mainAtomId: "c", linkedAtomIds: ["y"] },
      ],
    );
    expect(edges).toEqual([["a", "b"], ["b", "c"]]);
  });
});
