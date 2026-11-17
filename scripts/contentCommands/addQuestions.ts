import { insertQuestions } from "../../src/content/insertQuestions";
import { printRefusal, readJsonFromStandardInput, type ContentCommandInput } from "./commandInput";

// add-questions: inserts draft questions. Without --append the batch must be a
// complete first generation (six per atom). Lint warnings print but do not block.
export async function addQuestionsCommand({ lecture, append }: ContentCommandInput) {
  const questions = await readJsonFromStandardInput();
  const result = await insertQuestions({ lectureId: lecture.id, questions, isFirstGeneration: !append });

  if (!result.ok) {
    printRefusal(result.errors);
    return false;
  }

  console.log(`Added ${result.questionIds.length} draft questions to lecture ${lecture.number}.`);
  if (result.warnings.length > 0) {
    console.log(`${result.warnings.length} lint warning${result.warnings.length === 1 ? "" : "s"} (inserted anyway):`);
    for (const warning of result.warnings) console.log(`  - ${warning}`);
  } else {
    console.log("No lint warnings.");
  }
  return true;
}
