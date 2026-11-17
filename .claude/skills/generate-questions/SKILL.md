---
name: generate-questions
description: Write draft review questions for every atom of one lecture and insert them into Flashbang, or top up a single atom. Use when Joe says "generate questions for lecture N" or "more questions for this atom".
---

# generate-questions

First draft. Joe will tune this.

Writes six draft questions for each atom of a lecture: two multiple choice, two multi-select, two true/false, one of the six marked introductory. Joe reads and edits every one on the author page before publishing.

## Steps

1. **Read the rules.** `rules.md` and `examples.md` in this folder, every time. Joe edits them.
2. **Read the atoms.** `pnpm content:prod list --lecture N` prints each atom's id and sentence. For linked atoms from earlier lectures, run it for those lectures too.
3. **Read the transcript in full.** The source library's folder is the path in `.claude/skills/source-library-path.txt`; the transcript is `transcripts/NN-slug.md`. Read the lecture's section of `guidebook.md` as well. Do not read old question drafts in the source library.
4. **Plan six angles per atom** before writing: for example cause, consequence, contrast, example, misconception, connection to another atom. Six questions that reword one fact are a failure.
5. **Write the set** as one JSON list in a temporary file outside the repo. Shape of one question:

   ```json
   {
     "mainAtomId": "<atom id>",
     "format": "multiple_choice",
     "prompt": "…",
     "options": [{ "text": "…", "isCorrect": false }, { "text": "…", "isCorrect": true }],
     "explanation": "…",
     "isIntroductory": false,
     "linkedAtoms": [{ "atomId": "<other atom id>", "weight": 0.3 }]
   }
   ```

   - `format` is `multiple_choice` (3 to 5 options, one correct), `multi_select` (4 to 6 options, one or more correct) or `true_false` (options are exactly `True` and `False`, one correct).
   - `linkedAtoms` may be empty. Link only where the question really draws on the other idea. Weight about 0.3; up to 0.5 when it leans on both equally.
6. **Check every question against `rules.md`,** one at a time, and against the transcript: is there exactly one defensible answer?
7. **Insert.** `pnpm content:prod add-questions --lecture N < questions.json`. A shape error stops the whole batch; fix it and run again. For a top-up of one atom, add `--append` (no six-per-atom check).
8. **Deal with lint warnings.** They are the mechanical check for Joe's two hard rules. Fix the question unless the warning is a false positive you can explain.
9. **Report to Joe:** how many questions went in, every lint warning left and why, any atom that was hard to cover from six angles, and that the drafts are waiting at `/author/N`.

To try a set without touching production, use `pnpm content` in place of `pnpm content:prod`; it writes to the dev database.
