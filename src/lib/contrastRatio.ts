// WCAG 2 contrast maths, used by scripts/checkContrast.ts to check the theme.
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
// Plain functions: no files, no browser. Colours are "#rgb" or "#rrggbb".

export type Rgb = { red: number; green: number; blue: number }; // each 0 to 255

export function parseHexColour(hexColour: string): Rgb {
  let digits = hexColour.trim().replace(/^#/, "");
  if (digits.length === 3) digits = digits.split("").map((digit) => digit + digit).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(digits)) throw new Error(`Not a hex colour: ${hexColour}`);
  return {
    red: parseInt(digits.slice(0, 2), 16),
    green: parseInt(digits.slice(2, 4), 16),
    blue: parseInt(digits.slice(4, 6), 16),
  };
}

// How bright a colour looks, 0 (black) to 1 (white), per the WCAG formula.
export function getRelativeLuminance({ red, green, blue }: Rgb): number {
  const [linearRed, linearGreen, linearBlue] = [red, green, blue].map((channel) => {
    const fraction = channel / 255;
    return fraction <= 0.03928 ? fraction / 12.92 : ((fraction + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

// 1 (no contrast) to 21 (black on white). The order of the two does not matter.
export function getContrastRatio(firstColour: Rgb, secondColour: Rgb): number {
  const firstLuminance = getRelativeLuminance(firstColour);
  const secondLuminance = getRelativeLuminance(secondColour);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

// A colour drawn at `opacity` (0 to 1) over another, e.g. a faded button over its panel.
export function blendOver(topColour: Rgb, opacity: number, bottomColour: Rgb): Rgb {
  const mix = (top: number, bottom: number) => Math.round(top * opacity + bottom * (1 - opacity));
  return {
    red: mix(topColour.red, bottomColour.red),
    green: mix(topColour.green, bottomColour.green),
    blue: mix(topColour.blue, bottomColour.blue),
  };
}
