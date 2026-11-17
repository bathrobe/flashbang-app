import { getLearnerLevel, getLevelFromXp } from "./levels";

// One review_event row, as much of it as the end screen needs.
export type TodayEvent = {
  mainAtomId: string;
  mainXpGained: number;
  linkedXpGained: { atomId: string; xp: number }[];
  cloutChange: number;
  mainXpBefore: number; // from the event's `before` snapshot
  answeredAt: Date;
  voided: boolean;
};

// An atom as it stands now (after today's answers).
export type AtomNow = { atomId: string; sentence: string; xpNow: number };

export type AtomGain = { atomId: string; sentence: string; xpGained: number; levelBefore: number; levelNow: number };

type Tally = { xpGained: number; reviewedDirectly: boolean; xpAtStartOfDay: number | null };

// Adds up today's answers into the end screen's totals. Voided answers (undone
// by a flag) are ignored. An atom's XP gained counts everything it got today:
// main XP from first attempts and retries, plus any linked share.
export function summarizeToday(input: { events: TodayEvent[]; atoms: AtomNow[]; cloutNow: number; learnerTotalXpNow: number }) {
  const events = input.events
    .filter((event) => !event.voided)
    .sort((first, second) => first.answeredAt.getTime() - second.answeredAt.getTime());

  // Map keeps insertion order, so atoms are listed in the order they were first touched.
  const tallies = new Map<string, Tally>();
  const getTally = (atomId: string) => {
    if (!tallies.has(atomId)) tallies.set(atomId, { xpGained: 0, reviewedDirectly: false, xpAtStartOfDay: null });
    return tallies.get(atomId)!;
  };

  for (const event of events) {
    const mainTally = getTally(event.mainAtomId);
    if (!mainTally.reviewedDirectly) {
      // Level before = the snapshot before its first direct answer, minus any
      // linked XP it picked up earlier today (that XP is already in the snapshot).
      mainTally.reviewedDirectly = true;
      mainTally.xpAtStartOfDay = event.mainXpBefore - mainTally.xpGained;
    }
    mainTally.xpGained += event.mainXpGained;
    for (const linked of event.linkedXpGained) getTally(linked.atomId).xpGained += linked.xp;
  }

  const atomsById = new Map(input.atoms.map((atomNow) => [atomNow.atomId, atomNow]));
  const gains: (AtomGain & { reviewedDirectly: boolean })[] = [];
  for (const [atomId, tally] of tallies) {
    const atomNow = atomsById.get(atomId);
    if (!atomNow) continue; // no progress row (skipped linked atom): nothing was gained
    // A linked-only atom has no snapshot: work back from its XP now.
    const xpAtStartOfDay = tally.xpAtStartOfDay ?? atomNow.xpNow - tally.xpGained;
    gains.push({
      atomId,
      sentence: atomNow.sentence,
      xpGained: tally.xpGained,
      levelBefore: getLevelFromXp(xpAtStartOfDay),
      levelNow: getLevelFromXp(atomNow.xpNow),
      reviewedDirectly: tally.reviewedDirectly,
    });
  }

  // Drops the internal reviewedDirectly flag from what the end screen gets.
  const withoutFlag = ({ atomId, sentence, xpGained, levelBefore, levelNow }: AtomGain): AtomGain =>
    ({ atomId, sentence, xpGained, levelBefore, levelNow });
  const xpGainedToday = gains.reduce((total, gain) => total + gain.xpGained, 0);
  const learnerLevelBefore = getLearnerLevel(input.learnerTotalXpNow - xpGainedToday);
  const learnerLevelNow = getLearnerLevel(input.learnerTotalXpNow);

  return {
    reviewedAtoms: gains.filter((gain) => gain.reviewedDirectly).map(withoutFlag),
    linkedOnlyAtoms: gains.filter((gain) => !gain.reviewedDirectly && gain.xpGained > 0).map(withoutFlag),
    atomLevelUps: gains.filter((gain) => gain.levelNow > gain.levelBefore).map(withoutFlag),
    learnerLevelUp: learnerLevelNow > learnerLevelBefore ? { levelBefore: learnerLevelBefore, levelNow: learnerLevelNow } : null,
    clout: { change: events.reduce((total, event) => total + event.cloutChange, 0), balance: input.cloutNow },
    xpGainedToday,
  };
}

export type TodaySummaryTotals = ReturnType<typeof summarizeToday>;
