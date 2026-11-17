import { readLectureContent } from "../../src/content/readLectureContent";
import type { ContentCommandInput } from "./commandInput";

// "2 draft, 4 active" from a list of values; "" when the list is empty.
function countByValue(values: string[]): string {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].map(([value, count]) => `${count} ${value}`).join(", ");
}

// list: the lecture's atoms with their ids, sentences and question counts.
export async function listCommand({ lecture }: ContentCommandInput) {
  const { atoms, questions } = await readLectureContent(lecture.id);
  // Deleted questions stay in the database but are not content any more.
  const liveQuestions = questions.filter((question) => question.status !== "deleted");

  console.log(`Lecture ${lecture.number}: ${lecture.title} [${lecture.status}]`);
  console.log(`${atoms.length} atoms, ${liveQuestions.length} questions`);

  for (const atom of atoms) {
    const atomQuestions = liveQuestions.filter((question) => question.mainAtomId === atom.id);
    const retiredNote = atom.status === "retired" ? " [retired]" : "";

    console.log("");
    console.log(`${atom.position}. ${atom.id}${retiredNote}`);
    console.log(`   ${atom.sentence}`);
    if (atom.transcriptRef) console.log(`   transcript: ${atom.transcriptRef}`);

    if (atomQuestions.length === 0) {
      console.log("   questions: 0");
      continue;
    }
    const introductoryCount = atomQuestions.filter((question) => question.isIntroductory).length;
    console.log(`   questions: ${atomQuestions.length} (${countByValue(atomQuestions.map((question) => question.status))})`);
    console.log(`   formats: ${countByValue(atomQuestions.map((question) => question.format))}; introductory: ${introductoryCount}`);
  }
  return true;
}
