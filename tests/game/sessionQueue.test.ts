import { describe, expect, it } from "vitest";
import { getQueueAfterAnswer } from "@/game/sessionQueue";

describe("getQueueAfterAnswer", () => {
  it("drops the front atom after a right answer", () => {
    expect(getQueueAfterAnswer(["a", "b", "c"], false)).toEqual(["b", "c"]);
  });

  it("puts a missed atom back three places later", () => {
    expect(getQueueAfterAnswer(["a", "b", "c", "d", "e"], true)).toEqual(["b", "c", "d", "a", "e"]);
  });

  it("puts a missed atom at the end when fewer than three cards remain", () => {
    expect(getQueueAfterAnswer(["a", "b", "c"], true)).toEqual(["b", "c", "a"]);
    expect(getQueueAfterAnswer(["a", "b"], true)).toEqual(["b", "a"]);
  });

  it("shows a missed atom again next when it is the only card left", () => {
    expect(getQueueAfterAnswer(["a"], true)).toEqual(["a"]);
  });

  it("does nothing to an empty queue", () => {
    expect(getQueueAfterAnswer([], true)).toEqual([]);
  });
});
