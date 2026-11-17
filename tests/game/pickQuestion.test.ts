import { describe, expect, it } from "vitest";
import { pickQuestion } from "@/game/pickQuestion";

const introductory = { id: "intro", isIntroductory: true };
const questionA = { id: "a", isIntroductory: false };
const questionB = { id: "b", isIntroductory: false };
const questionC = { id: "c", isIntroductory: false };

describe("pickQuestion", () => {
  it("returns null when the atom has no active question", () => {
    const input = { activeQuestions: [], reviewCount: 0, lastQuestionId: null, lastAnsweredAtByQuestionId: {} };
    expect(pickQuestion(input)).toBeNull();
  });

  it("shows the introductory question, labelled New, on a never-reviewed atom", () => {
    const picked = pickQuestion({
      activeQuestions: [questionA, introductory, questionB],
      reviewCount: 0,
      lastQuestionId: null,
      lastAnsweredAtByQuestionId: {},
    });
    expect(picked).toEqual({ question: introductory, isNew: true });
  });

  it("is not labelled New when a never-reviewed atom has no introductory question", () => {
    const picked = pickQuestion({
      activeQuestions: [questionA, questionB],
      reviewCount: 0,
      lastQuestionId: null,
      lastAnsweredAtByQuestionId: {},
    });
    expect(picked).toEqual({ question: questionA, isNew: false });
  });

  it("picks never-answered questions before answered ones", () => {
    const picked = pickQuestion({
      activeQuestions: [introductory, questionA, questionB],
      reviewCount: 2,
      lastQuestionId: "a",
      lastAnsweredAtByQuestionId: { intro: "2026-11-10T10:00:00Z", a: "2026-11-11T10:00:00Z" },
    });
    expect(picked).toEqual({ question: questionB, isNew: false });
  });

  it("picks the least recently answered question when all have been answered", () => {
    const picked = pickQuestion({
      activeQuestions: [questionA, questionB, questionC],
      reviewCount: 5,
      lastQuestionId: "c",
      lastAnsweredAtByQuestionId: {
        a: "2026-11-12T10:00:00Z",
        b: new Date("2026-11-10T10:00:00Z"),
        c: "2026-11-14T10:00:00Z",
      },
    });
    expect(picked?.question).toBe(questionB);
  });

  it("never repeats the last question shown when there is another", () => {
    // "a" was never recorded as answered, so it would sort first if it were not excluded.
    const picked = pickQuestion({
      activeQuestions: [questionA, questionB],
      reviewCount: 1,
      lastQuestionId: "a",
      lastAnsweredAtByQuestionId: { b: "2026-11-10T10:00:00Z" },
    });
    expect(picked?.question).toBe(questionB);
  });

  it("gives a retry a different question from the one just missed", () => {
    const picked = pickQuestion({
      activeQuestions: [introductory, questionA],
      reviewCount: 1,
      lastQuestionId: "intro",
      lastAnsweredAtByQuestionId: { intro: "2026-11-16T10:00:00Z" },
    });
    expect(picked).toEqual({ question: questionA, isNew: false });
  });

  it("uses the only question again when there is just one", () => {
    const picked = pickQuestion({
      activeQuestions: [questionA],
      reviewCount: 3,
      lastQuestionId: "a",
      lastAnsweredAtByQuestionId: { a: "2026-11-16T10:00:00Z" },
    });
    expect(picked).toEqual({ question: questionA, isNew: false });
  });
});
