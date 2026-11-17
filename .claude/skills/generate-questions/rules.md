# Rules for generated questions

Joe edits this file. The generator reads it every time.

## Joe's two hard rules

These are Joe's. A question that breaks either one is not finished.

1. **The correct answer is not noticeably longer than the wrong ones.** Keep all the options of a question about the same length. Aim for the correct one not being the longest.
2. **Wrong answers do not use absolute language while the correct answer is hedged.** Words such as always, never, all, none, only, every, entirely and completely in the wrong options, next to a careful correct option, give the answer away. Leave them out of the options, or use the same register in all of them.

`pnpm content add-questions` warns about both mechanically. A warning means fix the question, unless it is a false positive you can explain.

## The set

From the PRD.

- Each atom gets six questions: two multiple choice, two multi-select, two true/false.
- Exactly one of the six is introductory. Someone who has just heard the lecture can answer it, and it leads them back into the idea.
- Each question names its main atom. It may name linked atoms with weights, where it really draws on them.
- Our own words. No long quotations from the lecture; a short phrase in quotation marks is fine.
- Questions teach as well as test. Assume the learner heard the lecture.
- Each explanation states the atom's idea in full and adds one piece of context from the lecture.

## Claude's defaults

Joe has not discussed these. Change or delete them freely.

- The six questions on an atom come at it from different angles (cause, consequence, contrast, example, misconception, connection). They do not reword one fact.
- Across a set, about half the true/false statements are true, and the correct answer's position is spread evenly.
- Multi-select: vary how many options are correct (one to three of four or five).
- No "all of the above" or "none of the above".
- It cannot be answered from common sense alone, without the lecture.
- Wrong answers are things a half-remembering listener might believe.
- There is exactly one defensible answer, checked against the transcript. If a historian could defend a wrong option from outside the lecture, replace it.
- The explanation adds something. It does not simply restate the answer.
- Where the lecture says something the wider scholarship would dispute, the prompt says "according to Garland" or "according to the lecture".
