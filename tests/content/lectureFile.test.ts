import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildLectureRows } from "@/content/lectureFile/buildLectureRows";
import { findPromptLeaks } from "@/content/lectureFile/findPromptLeaks";
import { findQuestionErrors } from "@/content/lectureFile/findQuestionErrors";
import { findUnevenOptions } from "@/content/lectureFile/findUnevenOptions";
import { checkLectureFileShape, type FileQuestion } from "@/content/lectureFile/lectureFileShape";
import { lintLectureFile } from "@/content/lectureFile/lintLectureFile";

// "*" marks a correct option.
const makeQuestion = (prompt: string, options: string[], overrides: Partial<FileQuestion> = {}): FileQuestion => ({
  id: prompt,
  format: "multiple_choice",
  rung: "recall",
  prompt,
  imageUse: "optional",
  options: options.map((option) => ({ text: option.replace("*", ""), isCorrect: option.startsWith("*") })),
  ...overrides,
});

describe("findQuestionErrors", () => {
  it("accepts a fill-the-blank with one blank and one correct option", () => {
    const question = makeQuestion("Offices were filled by ___.", ["*sortition", "election", "birth"], { format: "fill_blank" });
    expect(findQuestionErrors(question)).toEqual([]);
  });

  it("refuses a fill-the-blank with no blank in the prompt", () => {
    const question = makeQuestion("Offices were filled how?", ["*sortition", "election", "birth"], { format: "fill_blank" });
    expect(findQuestionErrors(question)[0]).toContain("exactly one ___");
  });

  it("refuses a multiple choice with two correct options", () => {
    expect(findQuestionErrors(makeQuestion("Pick one", ["*a", "*b", "c"]))[0]).toContain("exactly one correct");
  });
});

describe("findUnevenOptions", () => {
  it("warns when one option is far longer than another", () => {
    expect(findUnevenOptions(makeQuestion("Who?", ["*jurors", "council members of the city", "generals"]))).toHaveLength(1);
  });

  it("stays quiet for short options of mixed length", () => {
    expect(findUnevenOptions(makeQuestion("Who?", ["*generals", "magistrates", "councillors", "jurors"]))).toEqual([]);
  });
});

describe("findPromptLeaks", () => {
  const blankForMethod = makeQuestion("Athens filled offices by ___.", ["*sortition", "election", "birth"]);

  it("finds a prompt that states another question's answer", () => {
    const leaking = makeQuestion("Athens used sortition, except for the ___.", ["*generals", "jurors", "priests"]);
    const leaks = findPromptLeaks([blankForMethod, leaking]);
    expect(leaks).toHaveLength(1);
    expect(leaks[0].questionId).toBe(leaking.id);
  });

  it("lets the two directions of a people question share words", () => {
    const nameToFact = makeQuestion("Which conflict did Thucydides cover?", ["*The Peloponnesian War", "The Trojan War", "The Persian Wars"], { direction: "name_to_fact" });
    const factToName = makeQuestion("Who wrote the history of the Peloponnesian War?", ["*Thucydides", "Herodotus", "Aristophanes"], { direction: "fact_to_name" });
    expect(findPromptLeaks([nameToFact, factToName])).toEqual([]);
  });
});

describe("the lecture files in content/lectures", () => {
  it("lecture 1 has the right shape, no errors and no unexplained warnings", () => {
    const filePath = path.join(process.cwd(), "content", "lectures", "01-why-athenian-democracy-matters.json");
    const shape = checkLectureFileShape(JSON.parse(readFileSync(filePath, "utf8")));
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    const report = lintLectureFile(shape.lectureFile, ["Garland"]);
    expect(report.errors).toEqual([]);
    expect(report.warnings).toEqual([]);
  });

  it("lecture 1 becomes nine cards, with two template questions per term", () => {
    const filePath = path.join(process.cwd(), "content", "lectures", "01-why-athenian-democracy-matters.json");
    const shape = checkLectureFileShape(JSON.parse(readFileSync(filePath, "utf8")));
    if (!shape.ok) throw new Error("lecture 1 has the wrong shape");
    const { cards, questions } = buildLectureRows(shape.lectureFile);

    expect(cards.map((card) => card.kind)).toEqual(["atom", "atom", "atom", "term", "term", "term", "person", "person", "person"]);
    expect(cards.map((card) => card.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    // 10 written for atoms, 6 written for people, 2 made for each of 3 terms.
    expect(questions).toHaveLength(22);

    const isonomia = cards.find((card) => card.sentence.startsWith("isonomia"));
    const wordToMeaning = questions.find((row) => row.id === `${isonomia?.id}:word-to-meaning`);
    expect(wordToMeaning?.prompt).toBe("What does isonomia mean?");
    expect(wordToMeaning?.options.filter((option) => option.isCorrect).map((option) => option.text)).toEqual(["Equal laws for all"]);

    // Every card has exactly one introductory question, and option ids are stable.
    for (const card of cards) {
      expect(questions.filter((row) => row.mainAtomId === card.id && row.isIntroductory)).toHaveLength(1);
    }
    expect(buildLectureRows(shape.lectureFile).questions).toEqual(questions);
  });
});
