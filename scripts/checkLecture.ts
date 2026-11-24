import { exitWithReadableError } from "./exitWithReadableError";
import { printList, readLectureFile } from "./readLectureFile";

// `pnpm lecture:check 1` reads content/lectures/01-*.json and prints what is
// wrong with it. It never touches a database.

async function main() {
  const lectureNumber = Number(process.argv[2]);
  if (!Number.isInteger(lectureNumber)) throw new Error("Usage: pnpm lecture:check <lecture number>");

  const read = readLectureFile(lectureNumber);
  console.log(read.fileName);
  if (!read.lectureFile) {
    printList("The file's shape is wrong", read.shapeErrors);
    process.exit(1);
  }

  const { atoms, terms, people } = read.lectureFile;
  const questionCount = [...atoms, ...people].reduce((count, card) => count + card.questions.length, 0);
  console.log(`${atoms.length} atoms, ${terms.length} terms, ${people.length} people, ${questionCount} written questions`);

  const { errors, warnings, checkedByHand } = read.report;
  printList("Errors", errors);
  printList("Warnings", warnings);
  printList("Checked by hand", checkedByHand);
  if (errors.length === 0 && warnings.length === 0) console.log("\nNo errors or warnings.");
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(exitWithReadableError);
