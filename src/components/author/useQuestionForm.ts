"use client";

import { useState } from "react";
import type { AuthorQuestion } from "@/server/queries/getAuthorLecture";

export type QuestionFormat = AuthorQuestion["format"];
export type FormOption = { id: string; text: string; isCorrect: boolean };
// Weights are kept as typed text so a half-typed "0." is not lost; Save turns them into numbers.
export type FormLinkedAtom = { atomId: string; weight: string };

export type QuestionForm = {
  format: QuestionFormat;
  prompt: string;
  options: FormOption[];
  explanation: string;
  isIntroductory: boolean;
  mainAtomId: string;
  linkedAtoms: FormLinkedAtom[];
  imagePath: string;
  imageCredit: string;
  imageKind: "" | "sourced" | "generated";
};

const trueFalseOptions = (): FormOption[] => [
  { id: "true", text: "True", isCorrect: false },
  { id: "false", text: "False", isCorrect: false },
];

function formFromQuestion(question: AuthorQuestion): QuestionForm {
  return {
    format: question.format,
    prompt: question.prompt,
    options: question.options,
    explanation: question.explanation,
    isIntroductory: question.isIntroductory,
    mainAtomId: question.mainAtomId,
    linkedAtoms: question.linkedAtoms.map((link) => ({ atomId: link.atomId, weight: String(link.weight) })),
    imagePath: question.imagePath ?? "",
    imageCredit: question.imageCredit ?? "",
    imageKind: question.imageKind ?? "",
  };
}

// What saveQuestion receives: the content script's question JSON, option ids kept.
export function fieldsFromForm(form: QuestionForm) {
  return {
    ...form,
    linkedAtoms: form.linkedAtoms.map((link) => ({ atomId: link.atomId, weight: Number(link.weight) })),
    imagePath: form.imagePath.trim() || null,
    imageCredit: form.imageCredit.trim() || null,
    imageKind: form.imageKind || null,
  };
}

// The question's fields as typed, starting from what is saved. Nothing here
// resets after a failed save, so the typed text stays.
export function useQuestionForm(question: AuthorQuestion) {
  const [form, setForm] = useState(() => formFromQuestion(question));

  // Marking another question introductory unmarks this one on the server; when
  // the page refreshes, follow that one field without touching anything typed.
  const [savedIntroductory, setSavedIntroductory] = useState(question.isIntroductory);
  if (question.isIntroductory !== savedIntroductory) {
    setSavedIntroductory(question.isIntroductory);
    setForm((current) => ({ ...current, isIntroductory: question.isIntroductory }));
  }

  const updateForm = (changes: Partial<QuestionForm>) => setForm((current) => ({ ...current, ...changes }));

  // True/false always has exactly the options True and False.
  const changeFormat = (format: QuestionFormat) =>
    updateForm(format === "true_false" ? { format, options: trueFalseOptions() } : { format });

  return { form, updateForm, changeFormat };
}
