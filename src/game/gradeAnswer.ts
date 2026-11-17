// Grades one answer against the options stored on the question.
// Right only when the chosen set is exactly the correct set: no partial credit.

type StoredOption = { id: string; isCorrect: boolean };

export function gradeAnswer(storedOptions: StoredOption[], chosenOptionIds: string[]) {
  const storedIds = new Set(storedOptions.map((option) => option.id));
  const correctOptionIds = storedOptions.filter((option) => option.isCorrect).map((option) => option.id);
  const chosenIds = [...new Set(chosenOptionIds)]; // a repeated id counts once
  const unknownOptionIds = chosenIds.filter((chosenId) => !storedIds.has(chosenId));

  const wasCorrect =
    unknownOptionIds.length === 0 &&
    chosenIds.length === correctOptionIds.length &&
    correctOptionIds.every((correctId) => chosenIds.includes(correctId));

  return { wasCorrect, correctOptionIds, chosenOptionIds: chosenIds, unknownOptionIds };
}
