import { readLectureContent } from "../../src/content/readLectureContent";
import type { ContentCommandInput } from "./commandInput";

// export: all of the lecture's content as JSON, for a backup in git.
// The `atoms` list has the shape add-atoms reads and the `questions` list has
// the shape add-questions reads (extra fields such as ids and status are ignored
// on the way back in), so a backup can be fed back to the script.
export async function exportLectureCommand({ lecture }: ContentCommandInput) {
  const { atoms, questions } = await readLectureContent(lecture.id);

  const backup = {
    lecture: { number: lecture.number, title: lecture.title, status: lecture.status },
    atoms: atoms.map((atom) => ({
      id: atom.id,
      position: atom.position,
      sentence: atom.sentence,
      transcriptRef: atom.transcriptRef,
      status: atom.status,
    })),
    questions: questions.map((question) => ({
      id: question.id,
      status: question.status,
      mainAtomId: question.mainAtomId,
      format: question.format,
      prompt: question.prompt,
      options: question.options,
      explanation: question.explanation,
      isIntroductory: question.isIntroductory,
      linkedAtoms: question.linkedAtoms,
      imagePath: question.imagePath,
      imageCredit: question.imageCredit,
      imageKind: question.imageKind,
      flagNote: question.flagNote,
    })),
  };

  console.log(JSON.stringify(backup, null, 2));
  return true;
}
