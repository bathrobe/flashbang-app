import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { checkLectureFileShape } from "../src/content/lectureFile/lectureFileShape";
import { lintLectureFile } from "../src/content/lectureFile/lintLectureFile";

// Reads content/lectures/NN-*.json for a lecture number, checks its shape and
// runs every mechanical check. Used by `lecture:check` and `lecture:load`.

const lecturesFolder = path.join(process.cwd(), "content", "lectures");
// Atoms are stated as plain facts, so the lecturer's name stays out of them.
const wordsKeptOutOfAtoms = ["Garland"];

export function readLectureFile(lectureNumber: number) {
  const prefix = `${String(lectureNumber).padStart(2, "0")}-`;
  const fileName = readdirSync(lecturesFolder).find((name) => name.startsWith(prefix) && name.endsWith(".json"));
  if (!fileName) throw new Error(`No file starting with ${prefix} in content/lectures`);

  const shape = checkLectureFileShape(JSON.parse(readFileSync(path.join(lecturesFolder, fileName), "utf8")));
  if (!shape.ok) return { fileName, shapeErrors: shape.errors };
  return { fileName, lectureFile: shape.lectureFile, report: lintLectureFile(shape.lectureFile, wordsKeptOutOfAtoms) };
}

export function printList(title: string, lines: string[]) {
  if (lines.length === 0) return;
  console.log(`\n${title} (${lines.length})`);
  for (const line of lines) console.log(`  - ${line}`);
}
