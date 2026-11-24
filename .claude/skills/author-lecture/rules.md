# Rules for authoring a lecture

Joe edits this file. Read it every time. Each rule came from a real correction; the example in brackets is what went wrong.

## Cards

A lecture yields three kinds of card. Events will be a fourth.

- **Atom**: a claim, in one sentence. The in-depth part of the story.
- **Term**: a word, its meaning, and a line on what it names.
- **Person**: who they were and why they matter here, with a portrait.

Glossary words and people are never atoms. [An atom that listed four Greek words became three terms.]

## Atoms

- **Stands on its own.** No outside context needed. Use the nouns. ["The regime's three contradictions" became "Athenian democracy had three…".]
- **A plain fact.** Never name the lecturer in the sentence.
- **One claim.** If it bundles several claims, split it or cut it.
- **No definitions in the sentence.** Use the word; define it in the blurb. ["Sortition means…" moved to the blurb.]
- **Blurb**: one or two more sentences. It is part of the atom and fair to test.
- **Quote**: the lecturer's own words backing the claim, with a timestamp. For authoring; not shown on the card.
- **Few.** Three good atoms beat seven. Cut what Joe is unsure of.

## Terms and people

- **Light.** They support the story; they are not the story. [Seven people questions beside ten atom questions made the sources look as important as the subject.]
- **Terms have no written questions.** Each is asked from two templates: see the word, pick the meaning; see the meaning, pick the word.
- **People get one fact, asked both ways round**: name to fact, and fact to name.
- **Portraits decorate.** A portrait is never the question.
- No "Who is this? <description>" prompts. They read as machine-made.
- A person card does not mention someone not yet taught.

## Questions

- **Formats**: multiple choice, multi-select, true/false, fill the blank. Matching is a board built from several cards' `matchPair`, not a written question.
- **The atom's shape decides how many**: two to five. A list atom gets one pick-them-out multi-select, not a question per item.
- **Tests exactly the card.** Answerable from the card's own content alone. Nothing new, and never an untaught name as the answer. [A question about the kleroterion; a question whose answer was Cleisthenes.]
- **Pointed.** The prompt asks for one specific thing. ["Athens held its empire together by ___" was too vague.]
- **Wrong answers are plainly wrong.** None could be argued as right. ["The profits of trade" as a wrong answer for what gave citizens free time.]
- **Not obvious.** If someone who has never seen the card could get it right, cut it. ["What was the harshest thing Athens did?" with massacre among the options.] Good wrong answers are what a sensible outsider would guess. [For Athens' pillars: elections, parties, a bill of rights.]
- **No leaks.** No prompt states the answer to another question on the same card.
- **Even options.** About the same length, right or wrong, and all fitting the prompt's grammar. ["Which war…" ruled out the plural options.]
- **Rungs**: recognise, recall, apply. Use apply where the card supports a small new case.

`pnpm lecture:check` catches option counts, uneven lengths, absolute words in wrong answers, and word-for-word leaks. The rest needs judgment.

## Images

- Use them often. All text is dull.
- An image belongs to a card and must relate to it, with a caption that explains it and a credit.
- It shows at random, on the question or on the answer, and sometimes not at all. Caption and credit appear with the answer.
- It is never the question. Mark a question `imageUse: "never"` when the image would give the answer away.
