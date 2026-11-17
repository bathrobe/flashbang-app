import { describe, expect, it } from "vitest";
import { blendOver, getContrastRatio, getRelativeLuminance, parseHexColour } from "@/lib/contrastRatio";

describe("contrast maths", () => {
  it("reads three- and six-digit hex colours", () => {
    expect(parseHexColour("#fff")).toEqual({ red: 255, green: 255, blue: 255 });
    expect(parseHexColour("#0047ab")).toEqual({ red: 0, green: 71, blue: 171 });
    expect(() => parseHexColour("rgb(0 0 0)")).toThrow();
  });

  it("gives black 0 and white 1 luminance", () => {
    expect(getRelativeLuminance(parseHexColour("#000"))).toBe(0);
    expect(getRelativeLuminance(parseHexColour("#fff"))).toBeCloseTo(1, 10);
  });

  it("gives 21 for black on white, 1 for a colour on itself, in either order", () => {
    const black = parseHexColour("#000000");
    const white = parseHexColour("#ffffff");
    expect(getContrastRatio(black, white)).toBeCloseTo(21, 5);
    expect(getContrastRatio(white, black)).toBeCloseTo(21, 5);
    expect(getContrastRatio(white, white)).toBe(1);
  });

  it("matches a known WCAG value: #767676 on white is just over 4.5", () => {
    const ratio = getContrastRatio(parseHexColour("#767676"), parseHexColour("#ffffff"));
    expect(ratio).toBeGreaterThan(4.5);
    expect(ratio).toBeCloseTo(4.54, 2);
  });

  it("blends a colour over another at an opacity", () => {
    const black = parseHexColour("#000000");
    const white = parseHexColour("#ffffff");
    expect(blendOver(black, 0.6, white)).toEqual({ red: 102, green: 102, blue: 102 });
    expect(blendOver(black, 1, white)).toEqual(black);
  });
});
