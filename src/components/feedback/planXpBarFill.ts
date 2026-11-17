import { getLevelFromXp, getXpThresholdForLevel } from "@/game/levels";

// One stretch of an XP bar's fill, all inside one level.
export type XpBarSegment = {
  level: number; // the level the bar shows during this stretch
  levelStartXp: number; // XP at the bar's left end (this level's threshold)
  nextLevelXp: number; // XP at the bar's right end (the next level's threshold)
  fromXp: number;
  toXp: number;
  endsInLevelUp: boolean; // true when the bar fills to the end and the atom levels up
};

// The animation plan for one XP bar going from xpBefore to xpAfter. Each time
// the fill passes a threshold, that segment ends full and a new one starts
// from empty at the next level. After a level-up there is always one more
// segment (possibly not moving), so the bar finishes showing the new level.
// Plain function: no React, no timing. XpBar just plays the list in order.
export function planXpBarFill(xpBefore: number, xpAfter: number): XpBarSegment[] {
  const segments: XpBarSegment[] = [];
  let level = getLevelFromXp(xpBefore);
  let fromXp = xpBefore;

  while (true) {
    const levelStartXp = getXpThresholdForLevel(level);
    const nextLevelXp = getXpThresholdForLevel(level + 1);
    if (xpAfter < nextLevelXp) {
      segments.push({ level, levelStartXp, nextLevelXp, fromXp, toXp: Math.max(xpAfter, fromXp), endsInLevelUp: false });
      return segments;
    }
    segments.push({ level, levelStartXp, nextLevelXp, fromXp, toXp: nextLevelXp, endsInLevelUp: true });
    level += 1;
    fromXp = nextLevelXp;
  }
}

// How full the bar is (0 to 1) at a given XP inside a segment's level.
export function getFillFraction(segment: XpBarSegment, xp: number): number {
  const span = segment.nextLevelXp - segment.levelStartXp;
  return Math.min(1, Math.max(0, (xp - segment.levelStartXp) / span));
}
