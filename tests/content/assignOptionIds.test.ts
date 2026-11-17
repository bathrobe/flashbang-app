import { describe, expect, it } from "vitest";
import { assignOptionIds } from "@/content/assignOptionIds";
import { checkQuestionShape } from "@/content/questionShape";
import { makeMultipleChoice, makeTrueFalse } from "./makeQuestion";

const errorsFor = (candidate: unknown) => {
  const result = checkQuestionShape(candidate);
  return result.ok ? [] : result.errors;
};

describe("assignOptionIds", () => {
  const optionIdsOf = (question: unknown) => (question as { options: { id: string }[] }).options.map((option) => option.id);

  it("gives true/false options the ids true and false, whatever order or case", () => {
    const options = [{ text: " FALSE ", isCorrect: true }, { text: "True", isCorrect: false }];
    const withIds = assignOptionIds({ ...makeTrueFalse(), options });
    expect(optionIdsOf(withIds)).toEqual(["false", "true"]);
    expect(errorsFor(withIds)).toEqual([]);
  });

  it("gives other options short, distinct ids and keeps ids that already exist", () => {
    const options = [{ text: "One", isCorrect: true }, { id: "kept", text: "Two", isCorrect: false }, { text: "Three", isCorrect: false }];
    const optionIds = optionIdsOf(assignOptionIds({ ...makeMultipleChoice(), options }));
    expect(optionIds[1]).toBe("kept");
    expect(optionIds[0]).toHaveLength(8);
    expect(new Set(optionIds).size).toBe(3);
  });

  it("passes malformed input through for the shape check to report", () => {
    expect(assignOptionIds(null)).toBe(null);
    expect(errorsFor(assignOptionIds({ ...makeMultipleChoice(), options: "none" }))).toEqual(["options must be a list"]);
  });
});
