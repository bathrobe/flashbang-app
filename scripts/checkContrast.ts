// Checks every text-on-fill pair in the starting theme against WCAG's 4.5 to 1.
// Run: pnpm exec tsx scripts/checkContrast.ts
// Prints a table and exits with code 1 if any pair is under 4.5.

import { readFileSync } from "node:fs";
import path from "node:path";
import { blendOver, getContrastRatio, parseHexColour } from "../src/lib/contrastRatio";
import { contrastPairs } from "./contrastPairs";

const minimumRatio = 4.5;
const themePath = path.join(__dirname, "../src/app/themes/starting.css");

// Reads every "--color-name: #hex;" line. Non-hex values (the rgb() scrim) are skipped:
// nothing is written on the scrim itself.
function readThemeColours(cssText: string): Record<string, string> {
  const colours: Record<string, string> = {};
  for (const match of cssText.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    colours[match[1]] = match[2];
  }
  return colours;
}

const colours = readThemeColours(readFileSync(themePath, "utf8"));

function colourOf(tokenName: string) {
  const hex = colours[tokenName];
  if (!hex) throw new Error(`No --color-${tokenName} in ${themePath}`);
  return parseHexColour(hex);
}

let failureCount = 0;
console.log(`Contrast in ${path.relative(process.cwd(), themePath)} (minimum ${minimumRatio}:1)\n`);

for (const pair of contrastPairs) {
  let textColour = colourOf(pair.text);
  let fillColour = colourOf(pair.fill);
  if (pair.fadedTo !== undefined && pair.fadedOver) {
    textColour = blendOver(textColour, pair.fadedTo, colourOf(pair.fadedOver));
    fillColour = blendOver(fillColour, pair.fadedTo, colourOf(pair.fadedOver));
  }
  const ratio = getContrastRatio(textColour, fillColour);
  const passes = ratio >= minimumRatio;
  if (!passes) failureCount += 1;
  const faded = pair.fadedTo !== undefined ? ` at ${pair.fadedTo * 100}%` : "";
  console.log(
    `${passes ? "ok  " : "FAIL"} ${ratio.toFixed(2).padStart(5)}  ${pair.name.padEnd(38)} ${pair.text} on ${pair.fill}${faded}`,
  );
}

console.log(failureCount === 0 ? "\nEvery pair passes." : `\n${failureCount} pair(s) under ${minimumRatio}:1.`);
process.exit(failureCount === 0 ? 0 : 1);
