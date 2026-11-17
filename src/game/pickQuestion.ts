type QuestionChoice = { id: string; isIntroductory: boolean };

type PickQuestionInput<Question extends QuestionChoice> = {
  activeQuestions: Question[];
  reviewCount: number; // first attempts made on this atom so far
  lastQuestionId: string | null; // the question shown last time
  // When each question was last answered (ISO string or Date). Missing = never answered.
  lastAnsweredAtByQuestionId: Record<string, string | Date | null | undefined>;
};

// Chooses the atom's next question. Returns null when the atom has no active question.
export function pickQuestion<Question extends QuestionChoice>(input: PickQuestionInput<Question>) {
  const { activeQuestions, reviewCount, lastQuestionId, lastAnsweredAtByQuestionId } = input;
  if (activeQuestions.length === 0) return null;

  // An atom's very first card is its introductory question, labelled "New".
  const introductoryQuestion = activeQuestions.find((question) => question.isIntroductory);
  if (reviewCount === 0 && introductoryQuestion) return { question: introductoryQuestion, isNew: true };

  if (activeQuestions.length === 1) return { question: activeQuestions[0], isNew: false };

  // Never-answered questions count as answered at time 0, so they sort first.
  const answeredAtTime = (question: Question) => {
    const answeredAt = lastAnsweredAtByQuestionId[question.id];
    return answeredAt ? new Date(answeredAt).getTime() : 0;
  };

  // Array sort is stable, so ties keep the order the questions were given in.
  const leastRecentlyAnsweredFirst = activeQuestions
    .filter((question) => question.id !== lastQuestionId)
    .sort((first, second) => answeredAtTime(first) - answeredAtTime(second));

  return { question: leastRecentlyAnsweredFirst[0], isNew: false };
}
