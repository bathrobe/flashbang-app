---
name: author-lecture
description: Author one Athenian Democracy lecture with Joe in conversation, from recall to a checked lecture file of atoms, terms, people and questions. Use when Joe says "let's do lecture N", "author lecture N", or comes back after listening to a lecture.
---

# author-lecture

One conversation takes a lecture from "Joe just listened" to a checked file at `content/lectures/NN-slug.json`. That file is the source of truth for the lecture. Joe reviews on an artifact page and steers in chat; he does not author in the admin panel.

This replaces `lecture-conversation` and `generate-questions`, which wrote straight to the database. Do not use those for a lecture that has a file: the next load would delete what they added.

Read `rules.md` in this folder before proposing anything. Joe edits it.

## Before you start

- Lecture number N (1 to 24).
- The source library's folder is the path in `.claude/skills/source-library-path.txt`. Transcript: `transcripts/NN-slug.md`. Outline: the lecture's section of `guidebook.md`.
- Earlier lectures' files in `content/lectures/`, so you know which terms and people are already taught.
- `content/lectures/01-why-athenian-democracy-matters.json` is the worked example of the file's shape.

## How to talk

- One question at a time. Small steps. Joe likes to move slowly and understand.
- Let him guess before you correct or teach.
- The transcript is a machine transcript. Quietly fix obvious mis-hearings of names.
- Say when a fact comes from outside the lecture.

## Steps

### 1. Recall

Ask Joe to say everything he remembers. Wait. Then draw out more with questions and small hints. Do not show lecture content until he has emptied his head.

### 2. Draft the lecture page

Read the transcript and guidebook section. Publish one artifact page for the lecture with:

- a summary in the lecture's own order, with approximate timestamps;
- proposed atoms, terms and people (and events, once a lecture has them), each checked against the transcript;
- under each atom, hidden behind a toggle: its blurb, a corroborating quote, and the transcript excerpt it came from.

Note on the page anywhere a proposed card says something the lecturer did not quite say.

### 3. Revise with Joe

Joe reacts in chat. Revise the same page and republish. Nothing is settled until he approves both what a card says and how it says it. Expect to cut: Lecture 1 went from seven atoms to three.

### 4. Draft the questions

Only when the cards are settled. Follow the question rules in `rules.md`. Add them to the page, each showing its format, its rung and its answer. Before showing Joe:

- apply the obviousness test and the arguably-right test to every question yourself;
- mark the ones you are unsure of, so he can review by exception.

### 5. Write the file and check it

Write `content/lectures/NN-slug.json`. Keep every existing id; give new cards and questions a fresh UUID. Then run:

```
pnpm lecture:check N
```

Fix every error and warning. If a warning is a false alarm Joe has accepted, put the reason on the question as `checkedByHand`.

Then load it into the dev database. The first run only prints what it would add and delete; show Joe, then apply:

```
pnpm lecture:load N
pnpm lecture:load N --yes
```

A card or question that is no longer in the file is deleted, with the answers recorded against it. `pnpm lecture:load:prod N` does the same to production: only run it when Joe says to, after the code it needs is deployed.

Images go in `public/question-images/` with a row in its `CREDITS.md`.

### 6. Finish

Tell Joe the counts (atoms, terms, people, questions), anything marked `checkedByHand`, and any connection to an earlier lecture's cards.
