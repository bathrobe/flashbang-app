import { describe, expect, it } from "vitest";
import { getCountUpValue } from "@/lib/countUpValue";

describe("getCountUpValue", () => {
  it("starts at the old value and ends at the new one", () => {
    expect(getCountUpValue(100, 125, 0, 900)).toBe(100);
    expect(getCountUpValue(100, 125, 900, 900)).toBe(125);
    expect(getCountUpValue(100, 125, 5000, 900)).toBe(125);
  });

  it("moves at a steady pace in whole numbers, up or down", () => {
    expect(getCountUpValue(100, 200, 450, 900)).toBe(150);
    expect(getCountUpValue(100, 75, 300, 900)).toBe(92);
  });

  it("returns the final value at once when the duration is 0", () => {
    expect(getCountUpValue(100, 0, 0, 0)).toBe(0);
  });
});
