import { describe, expect, it } from "vitest";
import { checkQuestionSet } from "@/content/questionSetShape";
import { makeSetForAtom } from "./makeQuestion";

const atoms = [
  { id: "atom-1", sentence: "Citizens voted by show of hands." },
  { id: "atom-2", sentence: "Officials were mostly chosen by lot." },
];

describe("checkQuestionSet", () => {
  it("accepts six per atom, two per format, one introductory", () => {
    const questions = [...makeSetForAtom("atom-1"), ...makeSetForAtom("atom-2")];
    expect(checkQuestionSet(questions, atoms)).toEqual([]);
  });

  it("names an atom that has no questions at all", () => {
    const errors = checkQuestionSet(makeSetForAtom("atom-1"), atoms);
    expect(errors.every((error) => error.includes("atom-2"))).toBe(true);
    expect(errors[0]).toContain("has 0 questions; it needs exactly 6");
  });

  it("refuses five questions and names the short format", () => {
    const questions = [...makeSetForAtom("atom-1").slice(0, 5), ...makeSetForAtom("atom-2")];
    const errors = checkQuestionSet(questions, atoms);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("has 5 questions");
    expect(errors[1]).toContain("has 1 true_false questions; it needs exactly 2");
  });

  it("refuses six questions split unevenly across formats", () => {
    const atomOneSet = makeSetForAtom("atom-1");
    atomOneSet[5] = { ...atomOneSet[1] }; // a third multiple choice in place of a true/false
    const errors = checkQuestionSet([...atomOneSet, ...makeSetForAtom("atom-2")], atoms);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("3 multiple_choice");
    expect(errors[1]).toContain("1 true_false");
  });

  it("refuses no introductory question, and two of them", () => {
    const noneIntroductory = makeSetForAtom("atom-1").map((question) => ({ ...question, isIntroductory: false }));
    const twoIntroductory = makeSetForAtom("atom-2");
    twoIntroductory[3] = { ...twoIntroductory[3], isIntroductory: true };

    const errors = checkQuestionSet([...noneIntroductory, ...twoIntroductory], atoms);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("atom-1");
    expect(errors[0]).toContain("has 0 introductory questions");
    expect(errors[1]).toContain("atom-2");
    expect(errors[1]).toContain("has 2 introductory questions");
  });
});
