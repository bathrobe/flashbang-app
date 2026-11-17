import { describe, expect, it } from "vitest";
import { getGradedOptionLooks } from "@/components/review/formats/getGradedOptionLooks";

describe("getGradedOptionLooks", () => {
  it("marks a right single answer correct and leaves the rest resting", () => {
    expect(getGradedOptionLooks("multiple_choice", ["a"], ["a"])).toEqual({ a: "correct" });
  });

  it("on a wrong single answer, marks the choice wrong and shows the correct one", () => {
    expect(getGradedOptionLooks("multiple_choice", ["b"], ["a"])).toEqual({ a: "correct", b: "wrong" });
  });

  it("on multi-select, marks correctly chosen, wrongly chosen and missed", () => {
    expect(getGradedOptionLooks("multi_select", ["a", "c"], ["a", "b"])).toEqual({
      a: "correct",
      b: "missed",
      c: "wrong",
    });
  });
});
