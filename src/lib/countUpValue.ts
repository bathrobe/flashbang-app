// The number a counter shows `elapsedMs` into counting from `from` to `to`.
// Whole numbers only, moving at a steady pace. A duration of 0 (no animation)
// means the final value straight away.
export function getCountUpValue(from: number, to: number, elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0 || elapsedMs >= durationMs) return to;
  if (elapsedMs <= 0) return from;
  return Math.round(from + (to - from) * (elapsedMs / durationMs));
}
