---
name: lecture-conversation
description: Run the post-lecture conversation for one Athenian Democracy lecture and save the agreed atoms to Flashbang. Use when Joe says "let's do lecture N", "lecture conversation N", or comes back after listening to a lecture.
---

# lecture-conversation

First draft. Joe will tune this.

A relaxed, turn-by-turn conversation after Joe has listened to a lecture. The goal is that Joe understands the lecture fully, and that it ends with four to seven atoms saved to the database. No questions are written here; that is the `generate-questions` skill.

## Before you start

- Lecture number N (1 to 24).
- The source library's folder is the path in `.claude/skills/source-library-path.txt`. Inside it:
  - transcript: `transcripts/NN-slug.md`
  - the lecture's outline and Questions to Consider: its section of `guidebook.md`
- Atoms from earlier lectures: `pnpm content:prod list --lecture M` for each earlier lecture M.
- You may look things up on the web when Joe asks something the transcript does not answer. Say when a fact comes from outside the lecture.

Do not read the transcript aloud to Joe or show him lecture content until step 1 is finished.

## How to talk

- One question at a time, then wait for Joe's answer. Never a list of questions in one message.
- Let him guess before you correct or teach.
- Keep Garland's claims separate from Joe's own interpretations.
- The transcript is a machine transcript. Quietly fix obvious mis-hearings of names (for example "parisiia" is parrhesia).

## Steps

### 1. Free recall

Ask Joe to say everything he remembers. Stop and wait. Do not add lecture content until he has emptied his head. Fragments are fine.

### 2. Draw out more

Reflect back what he recovered. Use questions and small hints so he can reconstruct more. Correct mistakes only after he has had room to retrieve or reason.

### 3. Check the source

Read the transcript and the guidebook section. Work out Garland's line of argument, what Joe's recall left out, and anything he may have mixed up.

### 4. Walk through the facts

Go through the lecture's facts step by step, in the lecture's order, a small piece at a time. Clear up anything Joe did not follow before moving on. Atoms are not proposed until this is done.

### 5. Agree the atoms

- Propose atoms a few at a time. Four to seven in total.
- Each atom is one sentence, in words Joe endorses. Cut, merge, split and rewrite together.
- Nothing is an atom until Joe approves both what it says and how it says it.
- Each atom gets a transcript reference: the file and the timestamp, for example `transcripts/03-solon-the-father-of-democracy.md [00:12:40]`.
- Atoms are in our own words, not long quotations from the lecture.

### 6. Connections

From Lecture 2 onward, look at the earlier lectures' atoms. Ask Joe whether a new atom sharpens, qualifies, supports or challenges an earlier one. Keep only connections that matter.

### 7. Save

Write the agreed atoms to a temporary JSON file outside the repo:

```json
[{ "sentence": "One sentence.", "transcriptRef": "transcripts/NN-slug.md [00:00:00]" }]
```

Show Joe the final list and get a yes. Then run:

```
pnpm content:prod add-atoms --lecture N < atoms.json
```

Finish by telling Joe:

- the atoms as saved, with their ids;
- the connections to earlier atoms, in plain sentences (the `generate-questions` skill uses these as linked atoms);
- that the next step is `generate-questions` for lecture N.
