// One active question and every atom it involves (its main atom and its links).
export type QuestionAtoms = { mainAtomId: string; linkedAtomIds: string[] };

// The session map's lines: a pair of today's atoms gets one line when any
// active question involves both, as main and linked or as two linked atoms.
// Each pair appears once, written in the order of `todayAtomIds`.
export function findSessionMapEdges(todayAtomIds: string[], questions: QuestionAtoms[]): [string, string][] {
  const positionById = new Map(todayAtomIds.map((atomId, position) => [atomId, position]));
  const pairKeys = new Set<string>();
  const edges: [string, string][] = [];

  for (const question of questions) {
    const involvedToday = [...new Set([question.mainAtomId, ...question.linkedAtomIds])]
      .filter((atomId) => positionById.has(atomId))
      .sort((first, second) => positionById.get(first)! - positionById.get(second)!);
    for (let firstIndex = 0; firstIndex < involvedToday.length; firstIndex++) {
      for (let secondIndex = firstIndex + 1; secondIndex < involvedToday.length; secondIndex++) {
        const pair: [string, string] = [involvedToday[firstIndex], involvedToday[secondIndex]];
        const pairKey = pair.join("|");
        if (pairKeys.has(pairKey)) continue;
        pairKeys.add(pairKey);
        edges.push(pair);
      }
    }
  }
  return edges;
}
