import { findLectureByNumber } from "../src/content/findLecture";
import { buildLectureRows } from "../src/content/lectureFile/buildLectureRows";
import { applyLectureSync, planLectureSync } from "../src/content/lectureFile/syncLectureRows";
import { closeDatabaseConnections } from "../src/server/db/client";
import { exitWithReadableError } from "./exitWithReadableError";
import { printList, readLectureFile } from "./readLectureFile";

// `pnpm lecture:load 1` makes lecture 1 in the dev database match its file in
// content/lectures. `pnpm lecture:load:prod 1` does the same to production.
// Without --yes it only prints what it would do. Cards and questions that are
// no longer in the file are deleted, with the answers recorded against them.

async function main() {
  const lectureNumber = Number(process.argv[2]);
  if (!Number.isInteger(lectureNumber)) throw new Error("Usage: pnpm lecture:load <lecture number> [--yes]");
  const confirmed = process.argv.includes("--yes");

  const read = readLectureFile(lectureNumber);
  console.log(read.fileName);
  if (!read.lectureFile) {
    printList("The file's shape is wrong", read.shapeErrors);
    return false;
  }
  if (read.report.errors.length > 0 || read.report.warnings.length > 0) {
    printList("Errors", read.report.errors);
    printList("Warnings", read.report.warnings);
    console.log("\nNot loaded. Fix these first (pnpm lecture:check shows the same list).");
    return false;
  }

  const lecture = await findLectureByNumber(lectureNumber);
  if (!lecture) throw new Error(`Lecture ${lectureNumber} is not in the database (pnpm db:seed creates the lectures)`);

  const { cards, questions } = buildLectureRows(read.lectureFile);
  const plan = await planLectureSync(lecture.id, cards, questions);
  console.log(`File: ${plan.cardsInFile} cards, ${plan.questionsInFile} questions (term questions included)`);
  console.log(`Will delete: ${plan.cardsToDelete.length} cards and ${plan.questionsToDelete.length} questions no longer in the file`);

  if (!confirmed) {
    console.log("\nNothing changed. Run again with --yes to apply.");
    return true;
  }
  await applyLectureSync(lecture.id, cards, questions, plan);
  console.log("\nLoaded.");
  return true;
}

main()
  .then(async (worked) => {
    await closeDatabaseConnections();
    process.exit(worked ? 0 : 1);
  })
  .catch(exitWithReadableError);
