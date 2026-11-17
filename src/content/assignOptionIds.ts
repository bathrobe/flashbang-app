// Gives every option an id before the shape check runs. Answers are stored and
// graded by option id, so an id must never change once a question exists.
//
// - True/false: the option whose text is "True" gets the id "true", and
//   "False" gets "false", whatever came in.
// - Other formats: an option keeps the id it has (an edit on the author page,
//   or an export fed back in); a new option gets a short random id.
//
// The input has not been shape-checked yet, so anything unexpected is passed
// through untouched for checkQuestionShape to report.

const newShortId = () => crypto.randomUUID().slice(0, 8);

export function assignOptionIds(rawQuestion: unknown): unknown {
  if (typeof rawQuestion !== "object" || rawQuestion === null) return rawQuestion;

  const question = rawQuestion as { format?: unknown; options?: unknown };
  if (!Array.isArray(question.options)) return rawQuestion;

  const options = question.options.map((rawOption) => {
    if (typeof rawOption !== "object" || rawOption === null) return rawOption;
    const option = rawOption as { id?: unknown; text?: unknown };

    if (question.format === "true_false") {
      const text = typeof option.text === "string" ? option.text.trim().toLowerCase() : "";
      const id = text === "true" || text === "false" ? text : newShortId();
      return { ...option, id };
    }

    const hasUsableId = typeof option.id === "string" && option.id.length > 0;
    return { ...option, id: hasUsableId ? option.id : newShortId() };
  });

  return { ...question, options };
}
