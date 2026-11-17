import { questionFormats } from "./questionShape";

// The rule for a FIRST generation of a lecture's questions: every atom gets
// exactly six questions, two per format, exactly one of them introductory.
// Topping up one atom later skips this check (add-questions --append).

export const questionsPerAtom = 6;
export const questionsPerFormat = 2;

type QuestionForSetCheck = { mainAtomId: string; format: string; isIntroductory: boolean };
type AtomForSetCheck = { id: string; sentence: string };

const shorten = (text: string) => (text.length > 60 ? `${text.slice(0, 60)}…` : text);

// Returns plain-word errors naming each atom whose set is wrong. Empty = fine.
export function checkQuestionSet(questions: QuestionForSetCheck[], atoms: AtomForSetCheck[]): string[] {
  const errors: string[] = [];

  for (const atom of atoms) {
    const atomQuestions = questions.filter((question) => question.mainAtomId === atom.id);
    const atomName = `Atom "${shorten(atom.sentence)}" (${atom.id})`;

    if (atomQuestions.length !== questionsPerAtom) {
      errors.push(`${atomName} has ${atomQuestions.length} questions; it needs exactly ${questionsPerAtom}`);
    }

    for (const format of questionFormats) {
      const formatCount = atomQuestions.filter((question) => question.format === format).length;
      if (formatCount !== questionsPerFormat) {
        errors.push(`${atomName} has ${formatCount} ${format} questions; it needs exactly ${questionsPerFormat}`);
      }
    }

    const introductoryCount = atomQuestions.filter((question) => question.isIntroductory).length;
    if (introductoryCount !== 1) {
      errors.push(`${atomName} has ${introductoryCount} introductory questions; it needs exactly 1`);
    }
  }

  return errors;
}
