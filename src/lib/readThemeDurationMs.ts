// Reads an animation time from the theme, e.g. "--transition-duration-bar-fill",
// so JavaScript timers match the theme file. Returns 0 where there is no page
// (rendering on the server), which simply means "no animation".
export function readThemeDurationMs(variableName: string): number {
  if (typeof document === "undefined") return 0;
  const rawValue = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  const amount = parseFloat(rawValue);
  if (Number.isNaN(amount)) return 0;
  // "700ms" or "0.7s"
  return rawValue.endsWith("ms") ? amount : amount * 1000;
}
