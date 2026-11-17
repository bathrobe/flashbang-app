import { describe, expect, it } from "vitest";
import { checkQuestionShape } from "@/content/questionShape";
import { makeMultipleChoice, makeMultiSelect, makeTrueFalse } from "./makeQuestion";

const errorsFor = (candidate: unknown) => {
  const result = checkQuestionShape(candidate);
  return result.ok ? [] : result.errors;
};
const makeOptions = (count: number, correctCount: number) =>
  Array.from({ length: count }, (_unused, index) => ({ id: `o${index}`, text: `Option ${index}`, isCorrect: index < correctCount }));

describe("checkQuestionShape", () => {
  it("accepts a valid question of each format", () => {
    expect(errorsFor(makeMultipleChoice())).toEqual([]);
    expect(errorsFor(makeMultiSelect())).toEqual([]);
    expect(errorsFor(makeTrueFalse())).toEqual([]);
  });

  it("multiple choice: 3 to 5 options, exactly one correct", () => {
    expect(errorsFor(makeMultipleChoice({ options: makeOptions(2, 1) }))[0]).toContain("3 to 5 options");
    expect(errorsFor(makeMultipleChoice({ options: makeOptions(6, 1) }))[0]).toContain("3 to 5 options");
    expect(errorsFor(makeMultipleChoice({ options: makeOptions(5, 1) }))).toEqual([]);
    expect(errorsFor(makeMultipleChoice({ options: makeOptions(4, 2) }))[0]).toContain("exactly one correct");
    expect(errorsFor(makeMultipleChoice({ options: makeOptions(4, 0) }))[0]).toContain("exactly one correct");
  });

  it("multi-select: 4 to 6 options, one or more correct", () => {
    expect(errorsFor(makeMultiSelect({ options: makeOptions(3, 1) }))[0]).toContain("4 to 6 options");
    expect(errorsFor(makeMultiSelect({ options: makeOptions(7, 2) }))[0]).toContain("4 to 6 options");
    expect(errorsFor(makeMultiSelect({ options: makeOptions(6, 6) }))).toEqual([]);
    expect(errorsFor(makeMultiSelect({ options: makeOptions(4, 0) }))[0]).toContain("at least one correct");
  });

  it("true/false: exactly the ids true and false, exactly one correct", () => {
    expect(errorsFor(makeTrueFalse({ options: makeOptions(2, 1) }))[0]).toContain('"True" and "False"');
    const bothCorrect = [
      { id: "true", text: "True", isCorrect: true },
      { id: "false", text: "False", isCorrect: true },
    ];
    expect(errorsFor(makeTrueFalse({ options: bothCorrect }))[0]).toContain("exactly one correct");
  });

  it("refuses an empty prompt, explanation or option text, naming the field", () => {
    expect(errorsFor(makeMultipleChoice({ prompt: "  " }))).toEqual(["prompt is empty"]);
    expect(errorsFor(makeMultipleChoice({ explanation: "" }))).toEqual(["explanation is empty"]);
    const options = [...makeOptions(2, 1), { id: "x", text: " ", isCorrect: false }];
    expect(errorsFor(makeMultipleChoice({ options }))).toEqual(["options.2.text is empty"]);
  });

  it("refuses an unknown format and a missing main atom", () => {
    expect(errorsFor(makeMultipleChoice({ format: "essay" }))[0]).toContain("format must be one of");
    expect(errorsFor(makeMultipleChoice({ mainAtomId: undefined }))).toEqual(["mainAtomId is missing"]);
  });

  it("link weights are above 0 and at most 1; a linked atom is not the main atom or repeated", () => {
    const withLinks = (linkedAtoms: unknown) => errorsFor(makeMultipleChoice({ linkedAtoms }));
    expect(withLinks([{ atomId: "atom-2", weight: 1 }])).toEqual([]);
    expect(withLinks([{ atomId: "atom-2", weight: 0 }])).toEqual(["linkedAtoms.0.weight must be above 0"]);
    expect(withLinks([{ atomId: "atom-2", weight: 1.1 }])).toEqual(["linkedAtoms.0.weight must be at most 1"]);
    expect(withLinks([{ atomId: "atom-1", weight: 0.5 }])[0]).toContain("same as the main atom");
    const linkedTwice = [{ atomId: "atom-2", weight: 0.5 }, { atomId: "atom-2", weight: 0.2 }];
    expect(withLinks(linkedTwice)[0]).toContain("linked twice");
  });

  it("an image path needs a credit", () => {
    expect(errorsFor(makeMultipleChoice({ imagePath: "/question-images/pnyx.jpg" }))[0]).toContain("credit");
    const credited = { imagePath: "/question-images/pnyx.jpg", imageCredit: "Wikimedia Commons", imageKind: "sourced" };
    expect(errorsFor(makeMultipleChoice(credited))).toEqual([]);
    expect(errorsFor(makeMultipleChoice({ imagePath: null, imageCredit: null, imageKind: null }))).toEqual([]);
  });

  it("fills in the optional fields", () => {
    const result = checkQuestionShape(makeMultipleChoice({ isIntroductory: undefined, linkedAtoms: undefined }));
    expect(result.ok && result.question.isIntroductory).toBe(false);
    expect(result.ok && result.question.linkedAtoms).toEqual([]);
  });
});
