# Flashbang: Athenian Democracy (working title) — Product Requirements

> Written 2026-11-16 from the /prd conversation. Covers **Stage 1** in full; Stages 2 and 3 are listed in "What We'd Add With More Time" and are expected to follow soon.
> Items marked *(default)* were proposed by Claude and not explicitly confirmed by Joe. Everything else was stated or accepted by Joe.
> Companion diagram: `docs/review-scoring-model.html` (also published at https://claude.ai/artifact/5NoojsY61dpArSAQ9MZPLz).

## Problem Statement

Someone working through a lecture course in the humanities has no tool that tracks which ideas they still hold and brings them back at the right time. Anki schedules isolated cards, so the learner memorises the wording of one prompt instead of the idea, and it gives no sense of a body of knowledge growing. Joe has tried three times to build a review practice around Garland's *Athenian Democracy* and each attempt stalled at Lecture 1, because the process around the reviewing grew faster than the listening.

Stage 1 must give one learner (Joe) a daily review of Lecture 1 that is quick, rewarding to answer, and still in use two weeks later, and give one admin (also Joe) a way to write and correct its content without that work becoming a production.

## Changes From `scope.md`

The conversation changed the scope in these places. Where the two documents disagree, this one wins.

| Topic | Scope said | Now |
|---|---|---|
| Sign-in | Cut from Stage 1 | Real sign-in in Stage 1; only Joe's account is let in |
| Hosting and stored progress | Stage 2 | Stage 1, because sign-in needs it. Settles "where is progress stored" |
| Seeing questions before review | Joe never sees them | Joe reads and edits every question at creation, then publishes |
| Formats | Four, including fill-in | Three: multiple choice, multi-select, true/false |
| Images | Not in Stage 1 | Optional on any question; Wikimedia, public domain, or labelled generated images |
| Sound | Not mentioned | Four sounds and a mute toggle |
| Confidence | Not in the scope's Stage 1 list | A four-step confidence slider that stakes clout |
| Clout | Did not exist | A per-learner number won and lost by confidence |
| Trial door | Did not exist | A locked placeholder on each studied lecture, opened by atom levels |
| XP and the scheduler | Open question | Separate numbers, both updated by the same answer |
| Linked credit and due dates | Open question | Linked credit is XP only in Stage 1 |

## Terms

Plain names, used the same way everywhere in this document.

| Name | Belongs to | Meaning |
|---|---|---|
| Atom | Lecture | One main idea from a lecture, in one sentence |
| Question | Atom | One self-grading interaction. Has one main atom and zero or more linked atoms |
| Link weight | Question | A number from 0 to 1 for each linked atom, set when the question is written. Default about one third |
| Introductory question | Atom | The one question, of an atom's set, always shown the first time the atom is reviewed |
| XP | Atom | Running total of credit earned on the atom. Only increases |
| Level | Atom | Worked out from XP by fixed thresholds. Never falls |
| Interval | Atom | Days to wait before the atom's next review |
| Due date | Atom | Date of the last first-attempt review plus the interval |
| Clout | Learner | A number staked with the confidence slider. Never below zero. Affects nothing else |
| Learner level | Learner | Worked out from the sum of all atom XP |
| First attempt | Session | The first question shown on a due atom in a session |
| Retry | Session | A different question on the same atom, shown later in the same session after a wrong first attempt |
| Trial door | Lecture | A locked placeholder that opens when every atom in the lecture reaches a set level |
| Draft, Published | Lecture | A lecture's content is invisible to learners until Joe publishes it |

## User Stories

### Signing In

- As Joe, I want to sign in with an account I already have so that my progress is tied to me and is there on any laptop.
  - [ ] A signed-out visitor sees a sign-in page with the app's name and one button per sign-in provider, and nothing else from the app.
  - [ ] Bluesky sign-in is offered. A second provider (Google) may be offered too; whether both ship in the first build is decided in /spec.
  - [ ] After signing in, Joe lands on the courses view.
  - [ ] Closing the browser and returning later keeps Joe signed in.
  - [ ] Signing out is available from the account menu and returns to the sign-in page.
  - [ ] If sign-in is cancelled or fails, the sign-in page shows a one-line message saying it did not complete, and the buttons still work.

- As Joe, I want only my account let in during Stage 1 so that nobody else lands in a half-built app.
  - [ ] Any account other than Joe's that completes sign-in sees a plain "not open yet" page with a sign-out control.
  - [ ] That page collects nothing: no email field, no waitlist.
  - [ ] Typing the address of any inner page while signed out or not allowed leads to the sign-in or "not open yet" page, never to course content.

### Navigation Bar

- As Joe, I want to see at a glance that I am signed in and whether anything is waiting so that I know what to do without hunting.
  - [ ] The navbar appears on every signed-in page.
  - [ ] Top right shows Joe's username and avatar from his sign-in account. If there is no avatar, a placeholder with his initial is shown.
  - [ ] Next to the username is the inbox. When atoms are due it shows a red badge with the number of atoms in the next session.
  - [ ] When nothing is due there is no badge and no number.
  - [ ] Clicking the inbox when atoms are due starts the review session. Clicking it when nothing is due shows "Nothing due" and when the next atom comes due.
  - [ ] The navbar shows Joe's learner level and his clout.
  - [ ] The navbar has a speaker toggle for sound *(default: placement)*.
  - [ ] The app's name in the navbar returns to the courses view.
  - [ ] Only Joe's admin account sees a link to the author page.

### Courses View

- As Joe, I want a top-level list of the courses I am studying this way so that the app is clearly built for more than one course.
  - [ ] The courses view lists every course, one entry each. In Stage 1 there is exactly one: *Athenian Democracy*.
  - [ ] The entry shows the course title, the lecturer, how many of its lectures are published (1 of 24), and how many atoms are due.
  - [ ] Clicking the entry opens the course view.
  - [ ] Today's date is shown in large type on this view, with a "Begin review" button when atoms are due.
  - [ ] When nothing is due, the button is replaced by "Nothing due" and when the next atom comes due.

### Course View

- As Joe, I want to see my progress across all 24 lectures so that I can tell where I am in the whole course.
  - [ ] All 24 lectures are listed in order with number and title.
  - [ ] A published lecture shows its atoms as a row of small items, each with its level, plus a due count if any are due.
  - [ ] Each atom item's look changes with its level, so levels can be told apart without reading a number.
  - [ ] Hovering or clicking an atom item shows its sentence, level, XP toward the next level, and next due date.
  - [ ] An unpublished lecture shows number and title greyed out, with placeholder slots where its atoms will be. It cannot be clicked.
  - [ ] The greyed lectures read as things waiting to be unlocked, not as errors or missing content.
  - [ ] Today's date and "Begin review" appear here too, with the same behaviour as on the courses view.

- As Joe, I want a locked trial door on each published lecture so that my atom levels are working toward something.
  - [ ] Each published lecture shows a trial door with its requirement in words, for example "All 7 atoms at Level 3."
  - [ ] The door shows progress toward the requirement, for example "4 of 7."
  - [ ] Level thresholds are set so that reviewing whenever atoms are due meets the requirement in about one to two weeks.
  - [ ] The moment the requirement is met, an unveiling plays with its own sound, once.
  - [ ] After the unveiling, and whenever the open door is clicked, the screen says "Coming soon." Nothing else is behind it.
  - [ ] A door that has opened stays open. Levels never fall, so it cannot re-lock.

### Starting a Lecture

- As a learner, I want a short step before a lecture's first review so that I do not dive into questions cold.
  - [ ] When a lecture is published and the learner has not started it, the course view shows "Start Lecture 1" on that lecture.
  - [ ] Step one is a listen check: "Have you finished Lecture 1?" with "Yes" and "Not yet."
  - [ ] "Not yet" returns to the course view with a line asking them to come back after listening. The lecture's atoms do not enter the inbox.
  - [ ] "Yes" leads to one plain screen listing the lecture's atoms as sentences, to be read once, with a "Begin" button.
  - [ ] Pressing "Begin" puts all of the lecture's atoms in the inbox, due now, and starts the session.
  - [ ] Before this step is completed, the lecture's atoms do not count toward the inbox badge.
  - [ ] This step has a fixed place in the flow so that the Stage 2 intake can replace the atom list without changing what comes before or after.

### Review Session

- As a learner, I want to review everything due in one sitting, one card at a time, so that the daily habit is small and clear.
  - [ ] A session contains every due atom once, most overdue first, plus any retries.
  - [ ] There is no cap on session length, except after a long gap (see Returning After a Gap).
  - [ ] The session shows how many cards remain.
  - [ ] Each card is one question. Its main atom is not named on the card before answering.
  - [ ] The first time an atom is ever reviewed, its introductory question is shown and the card is labelled "New."
  - [ ] On later reviews, the app picks a question on that atom other than the one last shown. If every question has been seen, it picks the least recently seen.
  - [ ] If an atom has only one question, that question is shown again.
  - [ ] Clout is visible throughout the session and changes as answers are given.

- As a learner, I want questions in several formats so that reviews stay interesting and I learn the idea, not one prompt's wording.
  - [ ] Multiple choice: one question, several options, exactly one correct. Choosing an option and confirming submits it.
  - [ ] Multi-select: one question, several options, one or more correct. It is correct only if the chosen set exactly matches. Anything else is wrong; there is no partial credit.
  - [ ] A multi-select card says that more than one option may be correct.
  - [ ] True/false: one statement and two choices.
  - [ ] The order of options is shuffled each time a multiple choice or multi-select question is shown.
  - [ ] Nothing can be submitted until an answer is chosen.
  - [ ] Once submitted, an answer cannot be changed.
  - [ ] Text on every button and option is easy to read against its background in every state: resting, hovered, chosen, correct, wrong.

- As a learner, I want images on questions wherever a good one exists so that the material feels like a place and not only text.
  - [ ] A question may have one image. A question without one looks complete, not like something is missing.
  - [ ] Every image shows a credit line: source and licence, or "Generated illustration" for a generated image.
  - [ ] Images come only from Wikimedia, other public domain or open-access sources, or automatic generation. No images from the Great Courses materials.
  - [ ] If an image fails to load, the card still shows the question and can be answered.

- As a learner, I want to set my confidence before answering so that being sure and right pays, and being sure and wrong costs.
  - [ ] Every card has a slider with four named steps: Guess, Hunch, Sure, All in.
  - [ ] The slider starts at Hunch on each card *(default)*.
  - [ ] The slider is set before the answer is submitted and locks on submission.
  - [ ] The card shows what the current step stakes: what clout would be won and lost.

- As a learner, I want every answer saved the moment I give it so that closing the tab loses nothing.
  - [ ] XP, clout, interval and due date are updated at each answer, not at the end of the session.
  - [ ] Closing the tab mid-session and reopening later shows whatever is still due, including any retry not yet cleared.
  - [ ] Answering the same atom from two tabs does not award XP twice for one review *(default)*.

- As a learner, I want to keep at a missed idea until I get it right so that I never leave a session with it wrong.
  - [ ] After a wrong first attempt, a retry on that atom is added later in the session, after at least a few other cards where there are any.
  - [ ] The retry is a different question on the same main atom. If the atom has no other question, the same one is used.
  - [ ] A wrong retry adds another retry. The session does not end while a retry is outstanding.
  - [ ] If the missed atom is the only card left, its retry is shown next.

### Answer Feedback and Scoring

- As a learner, I want a right answer to feel great so that I want one more card.
  - [ ] On a correct answer a pleasant sound plays and the chosen answer turns green.
  - [ ] An explanation appears that states the atom's idea in full and adds one piece of context.
  - [ ] The main atom is named, and its XP bar fills from its old value to its new one in view, on the card.
  - [ ] If the question has linked atoms, their XP bars appear stacked beneath the main atom's and fill in turn, each by its smaller share.
  - [ ] Clout counts up by the amount won.
  - [ ] A "Continue" control moves to the next card. Nothing advances on its own.

- As a learner, I want a wrong answer to teach me without punishing my progress so that I am not afraid to open the app.
  - [ ] On a wrong answer a gentle sound plays, the chosen answer is marked wrong, and the correct answer is shown.
  - [ ] On multi-select, feedback marks each option as correctly chosen, wrongly chosen, or missed.
  - [ ] The same kind of explanation appears as for a correct answer: the idea in full, plus context.
  - [ ] No atom's XP decreases and no level falls, ever.
  - [ ] Clout counts down by the amount lost.
  - [ ] The feedback says the atom will come back later in this session.

- As a learner, I want levels on each atom and on myself so that memory strength is visible as progress.
  - [ ] When an XP bar fills, the atom reaches the next level: a distinct sound plays, the card calls it out, and the bar restarts toward the following level.
  - [ ] The atom's look changes to its new level's look on the card and in the course view.
  - [ ] If one answer levels up more than one atom, each is called out.
  - [ ] The learner level rises when total XP crosses its threshold, and that is called out too.

- As a learner, I want confidence to be the gamiest part so that each card carries a small wager.
  - [ ] Clout carries over from day to day. It is never reset by the app.
  - [ ] A new learner starts with a small amount of clout *(default)*.
  - [ ] There is nothing to spend clout on in Stage 1.
  - [ ] An All in wipe has its own sound and a moment of emphasis.

**Scoring rules.** Amounts are placeholders for /spec; the shape is fixed.

| Outcome | Main atom XP | Linked atom XP | Main atom interval | Clout |
|---|---|---|---|---|
| Correct, first attempt | Base amount, plus a bonus that rises with confidence | Main atom's amount times the link weight | Grows; grows more at higher confidence | Gain by stake |
| Wrong, first attempt | None | None | Shrinks to short; shortest at high confidence | Loss by stake |
| Correct, retry | Small fixed amount | None | No change | No change |
| Wrong, retry | None | None | No change | No change |

| Confidence step | Correct | Wrong |
|---|---|---|
| Guess | Small gain | No loss |
| Hunch | Medium gain | Small loss |
| Sure | Large gain | Large loss |
| All in | Clout doubles | Clout goes to zero |

  - [ ] Only a first attempt changes an atom's interval and due date.
  - [ ] Linked atoms never have their interval or due date changed in Stage 1.
  - [ ] Clout never goes below zero; a loss larger than the balance leaves zero.
  - [ ] All in while correct always gains at least what Sure would have, so it is worth something at a balance of zero *(default)*.
  - [ ] An atom is shown only when due, so its first-attempt XP can be earned once per interval. There is no way to earn XP by repeating reviews on demand.

### End Screen

- As a learner, I want the end of a session to feel like collecting what I earned so that I close the app feeling good.
  - [ ] After the last card, an end screen appears.
  - [ ] It lists each atom touched this session with the XP it gained; the amounts count up one after another.
  - [ ] Level-ups from the session are called out.
  - [ ] Linked atoms that received a share are listed separately from atoms reviewed directly.
  - [ ] It shows clout won or lost over the session, and the new balance.
  - [ ] It shows progress toward the lecture's trial door.
  - [ ] It shows when the next atom comes due.
  - [ ] It draws a small map: the atoms touched this session as points, with a line between any two atoms that share a question.
  - [ ] It uses the feel of collecting spoils, with no battle imagery or battle wording.
  - [ ] A single control returns to the course view.
  - [ ] If the session was left and resumed, the end screen covers everything reviewed that day *(default)*.

### Returning After a Gap

- As a learner who has been away, I want to be eased back in so that returning feels easy and not like a debt.
  - [ ] After seven or more days without a review, opening the app shows a welcome-back message *(default: seven days)*.
  - [ ] The message greets the learner, says where they are in the course (lecture, learner level), and names anything published since they left.
  - [ ] It offers one button that starts a short session of about five atoms, most overdue first.
  - [ ] While the welcome-back state applies, the inbox badge shows the short session's count, not the full number due.
  - [ ] After the short session, the end screen offers "Keep going" for the remaining due atoms, and declining it is as easy as accepting.
  - [ ] Nowhere does the app use the word "overdue," show a broken streak, or show a red total of missed reviews.
  - [ ] XP, levels and clout are exactly as they were left.
  - [ ] The message is shown once per return and can be dismissed.

### Flagging a Question

- As a learner, I want to mark a bad question during review so that a wrong or ambiguous question does not cost me or come back.
  - [ ] Every card has a flag control, available before answering and on the feedback after answering.
  - [ ] Flagging removes the question from rotation immediately.
  - [ ] If the question had been answered, that answer's effects are undone: XP, clout, interval and due date return to what they were before it.
  - [ ] The atom is then shown with a different question, as a fresh first attempt *(default)*.
  - [ ] If the flagged question was the atom's only one, the atom is skipped for the session and marked on the author page as needing questions.
  - [ ] The learner may add a short note saying what was wrong. The note is optional.
  - [ ] Flagged questions appear at the top of the author page with their notes.

### Sound and Motion

- As a learner, I want sound I can switch off so that the app is pleasant in a quiet room.
  - [ ] There are sounds for: correct answer, wrong answer (gentle), level-up, All in wipe, and the trial door unveiling.
  - [ ] The speaker toggle in the navbar turns all sound on or off.
  - [ ] The choice is remembered for the account across sessions and devices.
  - [ ] With sound off, every event is still fully shown on screen.
  - [ ] When the system is set to reduce motion, animations are shortened or replaced by instant changes; nothing is hidden as a result *(default)*.
  - [ ] The app is laid out so it does not break at narrow widths. No phone-specific design or testing is required.

### Authoring: The Post-Lecture Conversation

- As the admin, I want a relaxed conversation with Claude after each lecture so that I understand it fully before anything is written down.
  - [ ] A skill in Claude Code runs the conversation for a named lecture.
  - [ ] Claude works from the lecture's transcript, the guidebook, and all earlier lectures' atoms, and may look things up on the web.
  - [ ] The conversation walks through the lecture's facts step by step and clears up anything Joe did not follow, before atoms are proposed.
  - [ ] It ends with a list of roughly four to seven atoms, each one sentence, each agreed by Joe.
  - [ ] Each atom records where in the transcript it comes from.
  - [ ] Connections to atoms from earlier lectures are noted where they exist.
  - [ ] Lecture 1's seven existing atoms (`lessons/01/learning.md`) are accepted as the starting content without redoing the conversation.

### Authoring: Generating Questions

- As the admin, I want Claude to generate a varied set of questions for each atom so that I am editing a good draft instead of writing from nothing.
  - [ ] A skill generates questions for every atom in a lecture.
  - [ ] Each atom gets six questions: two multiple choice, two multi-select, two true/false.
  - [ ] Exactly one of each atom's questions is marked introductory. It is answerable by someone who has just heard the lecture and leads them back into the idea.
  - [ ] Each question names its main atom and may name linked atoms with weights.
  - [ ] Each question has an explanation that states the atom's idea in full and adds one piece of context.
  - [ ] Generated questions arrive as drafts on the author page. They are not visible to learners.
  - [ ] Atoms and questions are in our own words. No long quotations from the lecture.

  Every generated question must meet these rules. The first two are Joe's and are hard requirements.
  - [ ] The correct answer is not noticeably longer than the wrong ones.
  - [ ] Wrong answers do not use absolute language while the correct answer is hedged or qualified.
  - [ ] Questions teach as well as test, assuming the learner heard the lecture.
  - [ ] The correct answer's position is spread evenly across a set; true/false statements are about half true *(default)*.
  - [ ] No "all of the above" or "none of the above" *(default)*.
  - [ ] It cannot be answered from common sense alone, without the lecture *(default)*.
  - [ ] Wrong answers are things a half-remembering listener might believe *(default)*.
  - [ ] There is exactly one defensible answer, checked against the transcript *(default)*.
  - [ ] The explanation adds something and does not simply restate the answer *(default)*.

- As the admin, I expect to tune the generator over many lectures so that its quality improves with use.
  - [ ] The generator's instructions and example questions live where Joe can read and edit them.
  - [ ] Joe can add a good or bad example to those instructions without changing the app.
  - [ ] Joe can ask for more questions for a single atom at any time; they arrive as drafts.

### Authoring: The Author Page and Publishing

- As the admin, I want to read and edit every atom and question so that nothing reaches a learner that I have not had the chance to fix.
  - [ ] The author page is visible only to Joe's admin account. Any other account that tries to open it is refused.
  - [ ] It lists a lecture's atoms, and under each atom its questions.
  - [ ] Flagged questions are listed first, with any learner note.
  - [ ] Every atom's sentence is an editable text field.
  - [ ] For every question these are editable: the question text, each answer option, which options are correct, the explanation, the main atom, the linked atoms and their weights, the image and its credit, and whether it is the introductory question.
  - [ ] Joe can add a question by hand, delete a question, and change a question's format by rewriting it.
  - [ ] Each atom shows how many questions it has, the count in each format, and a warning if it has no introductory question or fewer than three questions *(default: three)*.
  - [ ] The page is plain: lists and text fields. No design effort beyond legibility.
  - [ ] A saved edit shows a clear "Saved" confirmation; a failed save says so and keeps the typed text.

- As the admin, I want one publish action per lecture so that reviewing content does not become a ritual.
  - [ ] A lecture's atoms and questions are drafts until Joe presses "Publish lecture."
  - [ ] Publishing takes one action for the whole lecture. There is no per-question approval step.
  - [ ] Publishing is refused, with the reason shown, if any atom has no questions.
  - [ ] After publishing, the lecture appears in the course view with "Start Lecture N."
  - [ ] Edits made after publishing take effect on the next card shown.
  - [ ] Editing wording never changes XP, levels, intervals or due dates.
  - [ ] Changing which answer is correct does not rewrite past results.
  - [ ] Deleting a question never removes XP already earned from it.
  - [ ] An atom that has earned XP cannot be deleted; it can be retired, which removes it from review and keeps its XP *(default)*.
  - [ ] A question unflagged or fixed on the author page returns to rotation.

## What We're Building

Stage 1, complete when all of the following work for Joe's account with Lecture 1's seven atoms. Acceptance criteria are in the epics named.

1. **Sign-in, Joe only** (`Signing In`).
2. **Navbar** with account, inbox badge, learner level, clout, and mute (`Navigation Bar`).
3. **Courses view and course view**, with 23 greyed lectures and Lecture 1's atoms (`Courses View`, `Course View`).
4. **Trial door placeholder** on Lecture 1 (`Course View`).
5. **Start-lecture step**: listen check and atom list (`Starting a Lecture`).
6. **Review session** in three formats, with images where available, the confidence slider, per-card saving, and retries (`Review Session`).
7. **Feedback and scoring**: explanations, stacked XP bars, levels, clout, intervals (`Answer Feedback and Scoring`).
8. **End screen** with tallies and the small map (`End Screen`).
9. **Welcome-back flow** (`Returning After a Gap`).
10. **Flagging** (`Flagging a Question`).
11. **Sounds and mute** (`Sound and Motion`).
12. **Two authoring skills** and the **author page with publish** (`Authoring` epics).
13. **Content**: Lecture 1's seven atoms with six questions each, 42 in total, read and published by Joe.

There is no deadline. This is more than one sitting of build. If it has to be cut down to reach a usable daily review sooner, cut in this order, last item first to go:

1. Review session, feedback and scoring, per-card saving (the core; never cut)
2. Courses view, course view, navbar
3. Question generation skill and Lecture 1 content
4. End screen
5. Author page and publish
6. Flagging
7. Sign-in and hosted storage
8. Start-lecture step
9. Sounds
10. Trial door
11. Welcome-back flow
12. Images

## What We'd Add With More Time

Joe expects to return to this list soon. Stage 1 choices should not make these harder.

**Stage 2, before writing about it publicly**
- Other people can sign in and use it.
- The intake: after the listen check, a short lesson on the lecture's main points in a different medium, replacing the plain atom list. Modelled on Flashbang's Review and Cards stages: new items drop one at a time, the graph assembles and attaches to earlier lectures, items enter the deck.
- Loot beyond atoms: people, events, quotes, terms, each with its own type, browsable as the collection, which is also the glossary. Loot appears on the end screen.
- Matching format. Fill-in returns here if wanted.
- Progress heat map.
- Lectures 2 and 3.

**Stage 3, before the salon**
- Join at any lecture; a late joiner's deck starts where they joined.
- The 5 to 10 minute group warm-up at the start of a salon.
- The knowledge graph view across all lectures. The end-screen map is its seed.

**Later**
- What is behind the trial door: a final exam per lecture as a visual novel or adventure game. Unlocking in the manner of Star Fox 64 or Diddy Kong Racing.
- A shop to spend clout in.
- An atom reveals more detail, nuance and connections as it levels up.
- Linked credit that also moves linked atoms' due dates; choosing the question that covers the most due atoms; per-learner speed. The fuller Math Academy model.
- A streak gauge that fills on confident correct answers; a calibration figure ("when you say Sure, you are right 80% of the time").
- Splitting a long day into rounds once more than about 20 atoms are due.
- A fiction layer: story, classes, a narrative frame.
- Linking atoms into new ideas of the learner's own; a page per glossary term.
- A collapsible outline per lecture.
- Image hotspots and interactive diagrams.
- A dashboard across all courses.
- Salon recordings attached to lectures; a shared whiteboard during salons.
- Phone-specific design.

## Non-Goals

- **No typed or free-text answers, and no AI grading at answer time.** Every answer is graded by the app itself. AI works when questions are written, not when they are answered.
- **No XP loss, level loss, or streaks.** Forgetting shows up only as an atom coming due sooner. Anything that makes a missed day feel like debt works against the main goal.
- **No per-question approval gate.** Joe reads and edits freely, but publishing is one action per lecture. The old pass/revise/cut ritual is part of why earlier attempts stalled.
- **No other users in Stage 1.** No waitlist, invitations, profiles, or sharing.
- **No Great Courses material shown in the app.** No transcript text, audio, course images, or long quotations. Learners need their own access to the course.
- **No graph of prerequisites.** Links are "this question draws on these ideas," set per question. No ontology is built or maintained.
- **No polished authoring interface.** The author page is lists and text fields.
- **No story, characters, or battle imagery.** Game mechanics only.
- **No spending of clout.**

## Open Questions

**Needs an answer before or during /spec**
- The app's name. "Flashbang: Athenian Democracy" is a placeholder.
- Which sign-in providers ship in the first build: Bluesky only, or Bluesky and Google. Bluesky's sign-in is stricter to set up than Google's. Later, salon participants would each need an account with whichever is offered.
- Where the app is hosted and where progress is stored.
- The numbers: base XP, the confidence bonus, the retry amount, level thresholds, the trial door's level, clout gains and losses per step, starting clout. Thresholds must meet "door opens in one to two weeks."
- How intervals grow and shrink, including how confidence feeds in. The existing mockup (`app/review/index.html`) has one approach.
- Where course content lives so that the generation skill can write drafts and the author page can edit them.
- How the app decides which account is the admin.
- The look: turning "90s utopian scholastic with a few JRPG touches" into a concrete visual direction, including the look of each atom level.

**Can wait until build**
- Where the sounds come from.
- Which tool generates images, and how a generated image is checked before use.
- The exact wording of the welcome-back message and the listen check.
- How many "other cards" come between a miss and its retry.

**Not part of the build**
- A fixed weekly slot, possibly two, for the post-lecture conversation. Claude offered to find one in Joe's calendar; still owed.
- Whether the course video can be obtained.
