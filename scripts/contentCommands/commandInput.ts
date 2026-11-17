// What every content command receives, and how the add commands read their JSON.

export type ContentCommandInput = {
  lecture: { id: string; number: number; title: string; status: string };
  append: boolean;
};

// Reads all of standard input and parses it as JSON, e.g. `pnpm content add-atoms --lecture 1 < atoms.json`.
export async function readJsonFromStandardInput(): Promise<unknown> {
  if (process.stdin.isTTY) {
    throw new Error("No JSON on standard input. Pipe a file in, e.g. `< atoms.json`.");
  }

  let text = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) text += chunk;

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Standard input is not valid JSON (${(error as Error).message}).`);
  }
}

export function printRefusal(errors: string[]) {
  console.error(`REFUSED: nothing was inserted. ${errors.length} problem${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`  - ${error}`);
}
