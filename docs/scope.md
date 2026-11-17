# Flashbang: Athenian Democracy (working title)

> Scope written 2026-11-15 from the /scope conversation. The name is a placeholder: this is the next attempt at the Flashbang idea, but Joe has not chosen a name.

## Idea

A spaced-repetition learning game for humanities courses: after each lecture you and Claude decide the main ideas (atoms), Claude generates many self-grading questions for each one, and a daily or weekly review levels those atoms up while credit flows across the links between them. The feeling to aim for is "a Math Academy for the humanities," and the reaction to aim for is **"I wish this was what college was like."**

First course: Robert Garland's 24-lecture *Athenian Democracy* (The Great Courses).

## Who It's For

There are two audiences, and they never see each other's side.

**The admin (Joe, and later other course-runners).** Works in Claude Code. Listens to a lecture, then uses authoring skills to talk it through, settle the atoms, and have the questions generated. Needs this to be relaxed, not too long, and to fit a stable slot once or twice a week.

**The learner (Joe every morning; salon participants weekly).** Uses the app only, and only ever sees finished content.

- Joe wants a daily morning review he keeps up for 24 lectures. Three earlier builds each stalled at Lecture 1 because the process around them grew faster than the listening.
- Salon participants are InterIntellect attendees: knowledge and tech workers, bookish, introverted, earnest, there partly for friendship. They are expected to buy the course themselves. The pitch to them is "test out my edtech experiments as we learn the course." Their time must stay small: 5 to 10 minutes in the app at the start of each weekly salon, with reviewing at other times optional. They must be able to join at a later lecture and catch up easily.

The unmet need: nothing gives a lecture course the mastery-tracking and momentum that Math Academy gives maths. Anki comes closest but schedules isolated cards, has no sense of a concept with many angles, and is no fun.

## The Two Sessions

### Session A: after each lecture (admin side, in Claude Code)

1. Joe listens (gym) or watches.
2. He reviews the facts step by step with Claude and clears up anything he didn't understand. Claude has the transcript, the guidebook, and everything from earlier lectures, and is encouraged to look up supporting material on the web.
3. He takes his time until he understands the whole lecture and how it relates to what came before.
4. Joe and Claude co-create the atoms: roughly 4 to 7 per lecture, each one worthwhile idea in one sentence.
5. Claude generates the interactions. **Joe does not see them beforehand.** He meets them for the first time in review, like any learner. (This deliberately reverses the old "rehearsal gate.")

### Session B: review (learner side, in the app)

1. Open the app. Today's date in big letters, a friendly "begin review," and a sense of progress across the whole course at a glance.
2. Interactions appear one at a time, like cards in a deck, in many formats.
3. Every choice gets good feedback. A right answer feels great: the atom's XP bar climbs toward its next level, right there on the card, and linked atoms visibly gain a little XP too.
4. At the end, see what you reviewed and how it links to everything else.

Daily and weekly use are the same system. The scheduler only asks "what is due now?", so a daily user gets a few cards a day and a weekly user gets one longer batch. A late joiner's deck starts at the lecture they joined.

## Core Concepts

- **Atom.** One main idea from a lecture, in one sentence, co-decided by Joe and Claude. Atoms are the unit that gets scheduled and levelled. Lecture 1 already has seven (`lessons/01/learning.md`).
- **Interaction (variant).** One self-grading question about one or more atoms. Each atom has many, across several formats, so repeated reviews approach it from different angles instead of teaching the wording of one card.
- **One schedule per atom.** When an atom comes due, the app picks a variant you haven't just seen. The grade applies to the atom, not the card.
- **Links and flowing credit.** A question can be tagged with more than one atom, and answering it credits each. This is the cheap, day-one version of Math Academy's knowledge graph: in history the links are "this question draws on these ideas," not strict prerequisites.
- **XP and levels.** Every atom has its own XP bar and level (memory strength made visible). The learner has an overall level built from all of them.
- **Loot and the collection.** Knowledge items are loot you collect: atoms first, then people, events, quotes and terms. The collection screen is also the glossary; they are one feature. Atoms are main ideas, and events are their own type (old Flashbang used one icon for both).
- **No free-text answers for now.** They need either self-report or an AI judge, and both have costs. Use only formats the app can grade itself, and make harder versions with closer distractors. AI does its work when questions are generated, not when they are answered.

## Inspiration & References

**North star**
- Math Academy: knowledge graph, mastery, credit flowing between linked topics. https://mathacademy.com/how-our-ai-works and https://justinmath.com/individualized-spaced-repetition-in-hierarchical-knowledge-structures/
- 2 Hour Learning / Alpha School: the two-hour computer-based part of the day, but pitched at the college and independent-scholar level.
- Duolingo: the satisfying, slightly addictive game loop of answering.

**Also relevant**
- Execute Program: short lessons, machine-graded reviews, few review levels, a miss doesn't punish you unless you give up. A model for the low-demand salon mode. https://www.executeprogram.com/spaced-repetition and https://notes.andymatuschak.org/Execute_Program
- Quantum Country / Orbit: review prompts embedded in the reading, and Matuschak's later finding that readers need control over what enters their deck. https://notes.andymatuschak.org/Mnemonic_medium
- Brilliant.org: scrollytelling lessons (a candidate shape for the intake).
- Anki: the baseline daily-deck habit and heat map.
- Roam Research: playing with links between ideas.

**Joe's own prior art**
- Flashbang School, 2023-24: https://seph.news/projects/flashbang. Dev Log 0 (https://www.youtube.com/watch?v=0Qcefobh1MU) is the key reference. A module had three stages: **Video** (pop-up questions; each right answer drops typed loot into a "Your Loot" sidebar), **Review** (take each loot item in turn while a network graph assembles to 100%, knitting the isolated items into a whole), **Cards** (each item assigned to your deck). Loot is called back in later modules until it forms one graph of the course.
- Flashbang rebuild, June 2026: `~/Developer/archive/flashbang`. Three card variants per atom with rotation, multiple-choice / this-or-that / matching components, a simple scheduler. Its notes concluded that AI belongs at generation time, not answer time.
- This repo's review mockup: `app/review/index.html`. One FSRS schedule per atom, variant rotation, confidence blended with correctness. Multiple choice only.

**Design energy**
- **90s utopian scholastic**, with a few JRPG and skeuomorphic touches. The base is the optimistic educational-multimedia look of that era (Encarta, Eyewitness books, the Scholastic book fair, Magic School Bus). JRPG flavour is layered on sparingly: XP bars, menu windows, item-get moments, level-ups.
- Not Flashbang's dark minimalism, and not this repo's Greek pottery kit as it stands.
- Legibility is non-negotiable: Joe's first reaction to the old mockup was that button text was unreadable against its background.
- JRPG mechanics only. No story or fiction yet.

## Goals

- **Joe keeps using it.** A review practice that survives past Lecture 1 and through all 24.
- **Two "watch this" moments.** The answer moment (fast, rewarding, one-more-card) and the vista (looking out over the whole body of knowledge with mastery spreading across it).
- **Good enough to share and write about** before the salon, then to use with salon participants, probably January 2027.
- **A repeatable admin flow** so adding a lecture is a pleasant conversation, not a production.
- Longer term: grounding for an ancient-Athens visual novel, and a learning-tech project in its own right across many courses.

## What "Done" Looks Like

There is no hard deadline; good progress today is enough. Work is staged.

### Stage 1: first build

- Joe only, no sign-in.
- Lecture 1's seven atoms.
- Four self-grading formats: multiple choice, multi-select, true/false, fill-in.
- One schedule per atom with rotating variants; questions can credit several atoms.
- Home screen with today's date and "begin review."
- Feedback on every answer, with the atom's XP bar and level visibly rising, and linked atoms gaining XP.
- Overall player level.
- End screen: what you touched and what it links to.
- Admin side: a skill for the post-lecture conversation and a skill that generates interactions from atoms without showing them to Joe.

### Stage 2: before writing about it publicly

- Hosted, with sign-in.
- Matching format.
- Progress heat map.
- The intake after each lecture, modelled on Flashbang's Review and Cards stages: new loot drops one at a time, the graph assembles and attaches to earlier lectures, items enter the deck.
- Loot beyond atoms: people, events, quotes, terms, browsable as the collection/glossary.
- Lectures 2 and 3 in.

### Stage 3: before the salon

- Join at any lecture.
- The 5 to 10 minute group warm-up at the start of a salon.
- The knowledge graph view (the vista).

## What's Explicitly Cut

Cut from Stage 1, with reasons:

- **Sign-in and other users.** Nobody else uses it until Joe does daily.
- **Heat map, dashboard, knowledge graph view.** Nothing to show until there is review history.
- **The intake and non-atom loot.** Needs a second lecture to mean anything.
- **Matching, image hotspots, interactive diagrams, typed answers.** Four formats are enough to test whether variety works.
- **Free-text answers and AI grading.** Slow, flaky, and annoying when wrong.
- **The pre-approval rehearsal gate.** It was part of why earlier attempts stalled, and Joe now wants questions hidden until review. A way to flag a bad question during review can replace it.
- **Per-lecture illustrated artifact pages and the cumulative course map** from the old flow.

## Later

Kept on purpose, not scheduled:

- A fiction layer: story, classes, a narrative frame. "A big feature to build up."
- A visual novel or simulation layer where you play your atoms to score ideas.
- Zettelkasten-style linking of atoms into new ideas; a page per glossary term with breadcrumbs and links to atoms, terms and lectures.
- Generated intake media: a roughly 3-minute video, or a Brilliant-style scrollytell.
- A collapsible, progressively disclosed outline per lecture.
- Image hotspots and interactive diagrams with questions.
- A dashboard across all courses.
- The course's video (if obtainable) alongside the audio.
- Salon recordings attached to each lecture, as material for later games and sims.
- A FigJam-style whiteboard during salons.
- A richer Math Academy model, where linked credit changes when things come due.

## Loose Implementation Notes

Non-binding; settle in /spec.

- **New repo for the app.** It is meant for many courses and other users, and this repo's `CLAUDE.md` and `study-lecture` skill would steer a fresh chat back into the old flow. This repo stays the Athenian Democracy source library (audio, transcripts, guidebook, Lecture 1's atoms). These planning docs move to the new repo when it exists. Nothing here gets deleted.
- **Reuse rather than reinvent.** The per-atom scheduling and variant rotation in `app/review/index.html`, and the multiple-choice / this-or-that / matching components in `~/Developer/archive/flashbang/src/components/checks.tsx`.
- **Course content as plain files** that the generation skill writes and the app reads, so adding a lecture needs no code change.
- **Copyright line for anything public.** Atoms and questions in our own words are fine. Transcripts, audio and long Garland quotations are not published; learners need their own access to the course.
- **Joe's preferences:** functional style, TypeScript without fussy typing, long readable names, many files under 100 lines, `pnpm`.

## Open Questions

- The name.
- How XP relates to the scheduler underneath: is XP simply the scheduler's memory strength shown as a bar, or its own number?
- Does linked credit only show as XP at first, or does it also push back due dates (the real Math Academy effect)?
- Hosting and sign-in choice for Stage 2.
- Where review progress is stored in Stage 1 so it isn't lost if browser data is cleared.
- A fixed weekly slot (possibly two) for Session A in Joe's calendar. Claude offered to find one; not done yet.
- Whether the course video can be obtained.
