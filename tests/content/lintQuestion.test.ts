import { describe, expect, it } from "vitest";
import { lintQuestion } from "@/content/lintQuestion";

const makeQuestion = (correctTexts: string[], wrongTexts: string[], format = "multiple_choice") => ({
  format,
  options: [
    ...correctTexts.map((text) => ({ text, isCorrect: true })),
    ...wrongTexts.map((text) => ({ text, isCorrect: false })),
  ],
});

describe("lintQuestion: length rule", () => {
  it("warns when the correct option is more than 1.3 times the longest wrong option", () => {
    // 14 characters against 10: a ratio of 1.4.
    const warnings = lintQuestion(makeQuestion(["abcdefghijklmn"], ["abcdefghij", "abc"]));
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("1.3 times");
  });

  it("does not warn at exactly 1.3 times", () => {
    // 13 characters against 10.
    expect(lintQuestion(makeQuestion(["abcdefghijklm"], ["abcdefghij", "abc"]))).toEqual([]);
  });

  it("does not warn when a wrong option is the longest", () => {
    expect(lintQuestion(makeQuestion(["short"], ["a much longer wrong option", "tiny"]))).toEqual([]);
  });

  it("uses the longest correct option in a multi-select", () => {
    const question = makeQuestion(["abc", "abcdefghijklmnopqrst"], ["abcdefghij", "abcde"], "multi_select");
    expect(lintQuestion(question)).toHaveLength(1);
  });
});

describe("lintQuestion: absolute-language rule", () => {
  it("warns when a wrong option uses an absolute word and no correct option does", () => {
    const warnings = lintQuestion(makeQuestion(["Most citizens could"], ["Citizens never could", "Some of them"]));
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("never");
  });

  it("does not warn when a correct option also uses an absolute word", () => {
    expect(lintQuestion(makeQuestion(["Every citizen could"], ["Citizens never could", "Some of them"]))).toEqual([]);
  });

  it("matches whole words only, in any letter case", () => {
    // "wall", "nonetheless" and "overall" contain absolute words but are not ones.
    expect(lintQuestion(makeQuestion(["The long gate"], ["The city wall", "Overall, nonetheless"]))).toEqual([]);
    expect(lintQuestion(makeQuestion(["The long gates"], ["ALWAYS the wall", "The harbour"]))).toHaveLength(1);
  });

  it("catches each of the eight absolute words", () => {
    const absoluteWords = ["always", "never", "all", "none", "only", "every", "entirely", "completely"];
    for (const absoluteWord of absoluteWords) {
      const question = makeQuestion(["some men"], [`${absoluteWord} the men`, "a few women"]);
      expect(lintQuestion(question)).toHaveLength(1);
    }
  });
});

describe("lintQuestion: other cases", () => {
  it("returns both warnings when both rules are broken", () => {
    const question = makeQuestion(["A long and carefully hedged answer"], ["Never", "Always"]);
    expect(lintQuestion(question)).toHaveLength(2);
  });

  it("returns nothing for a clean question", () => {
    expect(lintQuestion(makeQuestion(["By lot"], ["By vote", "By birth"]))).toEqual([]);
  });

  it("skips true/false questions and questions with no wrong option", () => {
    expect(lintQuestion(makeQuestion(["True"], ["False"], "true_false"))).toEqual([]);
    expect(lintQuestion(makeQuestion(["one", "two", "three", "four"], [], "multi_select"))).toEqual([]);
  });
});
