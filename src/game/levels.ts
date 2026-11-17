import { settings } from "./settings";

// XP needed to BE at a level. Level 1 needs 0; above the table each level needs 50 more.
export function getXpThresholdForLevel(level: number): number {
  const { atomXpThresholds, xpPerLevelAboveTable } = settings.levels;
  const highestLevelInTable = atomXpThresholds.length;
  if (level <= highestLevelInTable) return atomXpThresholds[Math.max(level, 1) - 1];
  const levelsAboveTable = level - highestLevelInTable;
  return atomXpThresholds[highestLevelInTable - 1] + levelsAboveTable * xpPerLevelAboveTable;
}

// Level is always worked out from XP; it is never stored.
export function getLevelFromXp(xp: number): number {
  let level = 1;
  while (xp >= getXpThresholdForLevel(level + 1)) level += 1;
  return level;
}

// The XP at which the atom reaches its next level (the right-hand number on an XP bar).
export function getNextLevelXpThreshold(xp: number): number {
  return getXpThresholdForLevel(getLevelFromXp(xp) + 1);
}

// Learner level = 1 + floor(total atom XP / 100).
export function getLearnerLevel(totalXp: number): number {
  return 1 + Math.floor(totalXp / settings.levels.learnerXpPerLevel);
}

// Total XP at which the learner reaches their next level.
export function getNextLearnerLevelXpThreshold(totalXp: number): number {
  return getLearnerLevel(totalXp) * settings.levels.learnerXpPerLevel;
}

// The trial door opens when every active atom of the lecture is at the door
// level (Level 3). `atomXpValues` holds one XP total per active atom; an atom
// the learner has no progress on counts as 0. No atoms means no door.
export function isTrialDoorEarned(atomXpValues: number[]): boolean {
  if (atomXpValues.length === 0) return false;
  return atomXpValues.every((xp) => getLevelFromXp(xp) >= settings.levels.trialDoorLevel);
}
