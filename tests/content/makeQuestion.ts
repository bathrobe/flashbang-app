// Builders for the content tests: a valid question of each format, with any
// field overridable.

type QuestionOverrides = Record<string, unknown>;

const option = (id: string, text: string, isCorrect = false) => ({ id, text, isCorrect });

export function makeMultipleChoice(overrides: QuestionOverrides = {}) {
  return {
    mainAtomId: "atom-1",
    format: "multiple_choice",
    prompt: "Who could speak in the Assembly?",
    options: [option("a", "Any citizen", true), option("b", "Only generals"), option("c", "Only priests")],
    explanation: "Any citizen could address the Assembly.",
    isIntroductory: false,
    linkedAtoms: [],
    ...overrides,
  };
}

export function makeMultiSelect(overrides: QuestionOverrides = {}) {
  return makeMultipleChoice({
    format: "multi_select",
    options: [
      option("a", "Citizens", true),
      option("b", "Adult men", true),
      option("c", "Enslaved people"),
      option("d", "Foreign residents"),
    ],
    ...overrides,
  });
}

export function makeTrueFalse(overrides: QuestionOverrides = {}) {
  return makeMultipleChoice({
    format: "true_false",
    options: [option("true", "True", true), option("false", "False")],
    ...overrides,
  });
}

// A complete first-generation set for one atom: two per format, one introductory.
export function makeSetForAtom(atomId: string) {
  return [
    makeMultipleChoice({ mainAtomId: atomId, isIntroductory: true }),
    makeMultipleChoice({ mainAtomId: atomId }),
    makeMultiSelect({ mainAtomId: atomId }),
    makeMultiSelect({ mainAtomId: atomId }),
    makeTrueFalse({ mainAtomId: atomId }),
    makeTrueFalse({ mainAtomId: atomId }),
  ] as { mainAtomId: string; format: string; isIntroductory: boolean }[];
}
