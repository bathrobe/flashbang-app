import { findLectureByNumber } from "../src/content/findLecture";
import { closeDatabaseConnections } from "../src/server/db/client";
import { addAtomsCommand } from "./contentCommands/addAtoms";
import { addQuestionsCommand } from "./contentCommands/addQuestions";
import type { ContentCommandInput } from "./contentCommands/commandInput";
import { exportLectureCommand } from "./contentCommands/exportLecture";
import { listCommand } from "./contentCommands/list";
import { exitWithReadableError } from "./exitWithReadableError";

// The content script. `pnpm content <command>` talks to the dev database,
// `pnpm content:prod <command>` to production (see package.json).
// Every command returns true when it worked and false when it was refused.

const usage = `Usage:
  pnpm content list --lecture 1
  pnpm content add-atoms --lecture 1 < atoms.json            [{ sentence, transcriptRef }]
  pnpm content add-questions --lecture 1 < questions.json    first generation: six per atom
  pnpm content add-questions --lecture 1 --append < q.json   top up, no six-per-atom check
  pnpm --silent content export --lecture 1 > backup.json     (--silent keeps pnpm's own lines out of the file)
Use content:prod in place of content for the production database.`;

const commands: Record<string, (input: ContentCommandInput) => Promise<boolean>> = {
  list: listCommand,
  "add-atoms": addAtomsCommand,
  "add-questions": addQuestionsCommand,
  export: exportLectureCommand,
};

function parseArguments(commandLineArguments: string[]) {
  const commandName = commandLineArguments[0];
  const lectureFlagPosition = commandLineArguments.indexOf("--lecture");
  const lectureNumber = lectureFlagPosition === -1 ? NaN : Number(commandLineArguments[lectureFlagPosition + 1]);
  const append = commandLineArguments.includes("--append");
  return { commandName, lectureNumber, append };
}

async function main() {
  const { commandName, lectureNumber, append } = parseArguments(process.argv.slice(2));
  const command = commands[commandName] as (typeof commands)[string] | undefined;

  if (!command || !Number.isInteger(lectureNumber)) {
    console.error(command ? "Missing --lecture N." : `Unknown command: ${commandName ?? "(none)"}`);
    console.error(usage);
    process.exitCode = 1;
    return;
  }

  try {
    const lecture = await findLectureByNumber(lectureNumber);
    if (!lecture) {
      console.error(`REFUSED: there is no lecture ${lectureNumber}.`);
      process.exitCode = 1;
      return;
    }
    const succeeded = await command({ lecture, append });
    if (!succeeded) process.exitCode = 1;
  } finally {
    // Open connections would keep the script running.
    await closeDatabaseConnections();
  }
}

main().catch(exitWithReadableError);
