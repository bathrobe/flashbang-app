import { insertAtoms } from "../../src/content/insertAtoms";
import { printRefusal, readJsonFromStandardInput, type ContentCommandInput } from "./commandInput";

// add-atoms: reads [{ sentence, transcriptRef }] and prints the new ids.
export async function addAtomsCommand({ lecture }: ContentCommandInput) {
  const atoms = await readJsonFromStandardInput();
  const result = await insertAtoms({ lectureId: lecture.id, atoms });

  if (!result.ok) {
    printRefusal(result.errors);
    return false;
  }

  console.log(`Added ${result.atoms.length} atoms to lecture ${lecture.number}:`);
  for (const atom of result.atoms) {
    console.log(`  ${atom.position}. ${atom.id}  ${atom.sentence}`);
  }
  return true;
}
