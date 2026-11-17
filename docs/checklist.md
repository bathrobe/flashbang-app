# Build Checklist

> Written 2026-11-16 from the /checklist conversation. Implements Stage 1 of `docs/spec.md`.
> Joe delegated the sequencing to Claude and asked for a fully autonomous build. No hackathon submission: the final item is the production launch, not Devpost.

## Build Preferences

- **Build mode:** Autonomous
- **Comprehension checks:** N/A (autonomous mode)
- **Git:** Commit after each item with the message `Complete step N: [title]`, then push to `main`. Vercel deploys each push.
- **Verification:** No checkpoints. The build runs straight through and stops only at the points listed under "Needs Joe".
- **Check-in cadence:** N/A (autonomous mode)

## Names and places

- **App repo (local):** `~/Developer/flashbang`. All code is written there, never in the source library.
- **GitHub repo and Vercel project:** `flashbang-app`, public (Joe confirmed "for now"). A private GitHub repo and a Vercel project both named `flashbang` already exist from the earlier builds and must not be touched.
- **Google Cloud:** project `flashbang` (ID `flashbang-515001`) under Joe's account holds the OAuth client "Flashbang web". The consent screen is in Testing mode with Joe as the only test user. The localhost redirect address is already registered.
- **Already in place before item 1:** `~/Developer/flashbang` exists with `docs/`, `process-notes.md`, a `.gitignore` covering `.env*.local`, and `.env.local` holding `ALLOWED_EMAILS`, `ADMIN_EMAILS` and the two Google values. Scaffold around these files; do not overwrite them. Run /build from that folder; its `docs/checklist.md` is the live copy.
- **Source library:** `~/Developer/athenian-democracy` (transcripts, guidebook, `lessons/01/learning.md`). Read only.
- **Secrets:** only in `.env.local`, `.env.production.local` and Vercel's settings. Joe's email goes in `ALLOWED_EMAILS` and `ADMIN_EMAILS` there and is never written into a committed file.

## Needs Joe

The build cannot do these itself. If one is not ready, record it in this list as waiting, carry on with every item that does not depend on it, and report it in the final summary.

| When | What |
|---|---|
| Before item 3 | Paste `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into `~/Developer/flashbang/.env.local` (the lines are there, empty) |
| Item 1 | Possibly one browser click to accept Neon's terms when it is added through Vercel |
| After item 3 | Add the production redirect address to the Google OAuth client; sign in once locally and once on the Vercel address |
| Item 22 | Read and edit the 42 questions on `/author/1` in production, press "Publish lecture", do the first review |

**Resolved 2026-11-16:** Neon was created through the Vercel dashboard (database `flashbang-app-db`, Neon project `rapid-surf-84071289`, branches `main` and `dev`, Neon Auth off). The `.env.local` values lost to `vercel link` were pasted in again by Joe.

## Rules for the build agent

- Read `docs/spec.md` in full before item 1. Where the spec gives a number or rule, the spec wins over the PRD.
- Confirm the Next.js 16 and Better Auth calls against the docs linked in `spec.md > Stack` and `spec.md > Sign-In and Access` before writing code (spec Open Issue 12).
- Joe's code style: functional, no classes; long readable names; files under 100 lines; `pnpm`.
- Every server action checks access itself. The browser never receives which option is correct before an answer is submitted.
- Components use theme tokens only. A raw colour value in a component is a defect.
- Each item ends with `pnpm test` and `pnpm build` passing before the commit.
- If the build has to be cut short, drop items in this order, first to go first: 20, 19, 15, 13, 9, 16, 17 and 18, 14.

## Checklist

### Foundations: prove the risky plumbing first

- [x] **1. The empty app is on GitHub and live on Vercel with a Neon database attached**
  Spec ref: `spec.md > Runtime & Deployment > One-time setup` and `> Package scripts`; `spec.md > Stack`
  What to build: In `~/Developer/flashbang`, scaffold with `pnpm create next-app` (TypeScript, App Router, Tailwind v4, `src/` directory), keeping the existing `docs/`, `process-notes.md`, `.gitignore` entries and `.env.local` (scaffold in a temporary folder and move the files in if the tool refuses a non-empty folder). Install the packages in the Stack table. Add every script in the Package scripts table (stubs are fine where the target does not exist yet), `vitest.config.ts`, `.env.example` with the variable names only, and a `.gitignore` that covers `.env*.local`. Create the public GitHub repo and push. Create the Vercel project from it with Node 22 or later. Add Neon from the Vercel Marketplace, create a `dev` branch in Neon, and put its pooled connection string in `.env.local`; put the production string in `.env.production.local`.
  Acceptance: The placeholder page loads at the `*.vercel.app` address and at `http://localhost:3000`. `DATABASE_URL` is set in Vercel and locally. No secret is in git.
  Verify: Open the Vercel address and confirm the placeholder page. Run `pnpm dev` and confirm the same page locally. Run `git log -p | grep -i "postgres://"` and confirm no output.

- [x] **2. Every table exists in both database branches and the course is seeded**
  Spec ref: `spec.md > Data Model` (all subsections); `spec.md > Content Pipeline > Seed script`
  What to build: `src/server/db/client.ts` using Drizzle over the Neon driver's `Pool`. Table definitions in `src/server/db/schema/` for course, lecture, atom, question, question_link, atom_progress, learner_state, lecture_progress and review_event, exactly as listed in the spec. `drizzle.config.ts`, a generated migration, and `db:migrate` and `db:migrate:prod` working. `scripts/seedCourse.ts` inserting the course and 24 draft lectures with titles from `guidebook.md` in the source library, safe to run twice. Add a temporary route or script that runs one transaction (insert then roll back) so the `Pool` driver is proven on Vercel (spec Open Issue 11); if it fails there, switch `client.ts` to the `pg` driver as the spec says.
  Acceptance: Both branches hold all tables. The `dev` and production `lecture` tables each have 24 rows, all `draft`. A transaction commits and rolls back on Vercel's runtime.
  Verify: Run `pnpm db:seed` twice and confirm the second run changes nothing. Open the transaction check on the Vercel address and confirm it reports success, then remove it.

- [x] **3. Joe can sign in with Google, and everyone else is turned away**
  Spec ref: `spec.md > Sign-In and Access` (all subsections); `spec.md > Runtime & Deployment > Environment variables`
  What to build: `src/server/auth.ts`, the `api/auth/[...all]` route, `src/lib/authClient.ts`, and Better Auth's four tables generated with its command-line tool into `schema/auth.ts` and migrated. `src/server/access.ts` with `getSignedInUser`, `requireLearner` and `requireAdmin`. The sign-in page, the not-open page, `(signed-in)/layout.tsx` calling `requireLearner()`, and a placeholder `/courses` page with a sign-out control. Set all environment variables in Vercel, with a different `BETTER_AUTH_SECRET` in each environment.
  Acceptance: From `prd.md > Signing In`: a signed-out visitor sees only the app name and one Google button; Joe lands on the courses view after signing in and stays signed in after closing the browser; any other account sees "This isn't open yet." with a sign-out control and no fields; a cancelled sign-in shows the one-line message; typing an inner address while signed out leads to sign-in.
  Verify: Run `pnpm dev`, open `http://localhost:3000/courses` signed out and confirm the sign-in page. Sign in as Joe and confirm `/courses`. Sign in with another Google account and confirm the not-open page. Repeat on the Vercel address once the production redirect address is added.

### Rules and content: no screens needed

- [x] **4. The scoring rules pass their tests**
  Spec ref: `spec.md > Scoring Rules` (all subsections); `spec.md > Tests`
  What to build: `src/game/settings.ts`, `levels.ts`, `nextInterval.ts`, `clout.ts`, `scoreAnswer.ts`, `pickQuestion.ts` and `learnerDate.ts` as plain functions with the date passed in, and the six test files in `tests/game/`. Include the required test that replays a no-miss learner at each confidence step and asserts Level 3 by day 14.
  Acceptance: From `prd.md > Answer Feedback and Scoring`: XP never decreases; only a first attempt changes interval and due date; clout never goes below zero; All in while correct gains at least 25; a retry earns 3 XP and changes nothing else. Level 3 is at 40 XP.
  Verify: Run `pnpm test` and confirm every test passes, including the Level 3 by day 14 replay.

- [x] **5. The content script can list, add and export a lecture's atoms and questions**
  Spec ref: `spec.md > Content Pipeline > Content rules`, `> Question lint`, `> Content script`
  What to build: `src/content/questionShape.ts`, `questionSetShape.ts`, `lintQuestion.ts`, `insertAtoms.ts`, `insertQuestions.ts`, `updateQuestion.ts` and `publishLecture.ts`. `scripts/content.ts` with `scripts/contentCommands/` for `list`, `add-atoms`, `add-questions`, `add-questions --append` and `export`, reading JSON from standard input. `pnpm content` targets `dev`; `pnpm content:prod` targets production. `tests/content/lintQuestion.test.ts`.
  Acceptance: A batch with a shape error inserts nothing and names the error. Lint warnings print and do not block. A first generation is refused unless each atom has six questions, two per format, exactly one introductory. Questions arrive with status `draft`.
  Verify: Run `pnpm content add-questions --lecture 1` with a deliberately invalid batch and confirm it is refused and `pnpm content list --lecture 1` shows no new questions. Run `pnpm test`.

- [x] **6. Lecture 1 has seven atoms and 42 draft questions in the dev database**
  Spec ref: `spec.md > Content Pipeline > Skill: lecture-conversation`, `> Skill: generate-questions`, `> Source library access`, `> Lecture 1 content`
  What to build: `.claude/skills/source-library-path.txt`, `lecture-conversation/SKILL.md`, and `generate-questions/` with `SKILL.md`, `rules.md` (Joe's two hard rules first) and `examples.md`, all as first drafts. Add the seven atoms from `lessons/01/learning.md` unchanged with `add-atoms`. Follow the `generate-questions` skill to write 42 questions against the Lecture 1 transcript, in our own words, and insert them with `add-questions`. For building later screens, publish Lecture 1 in `dev` only by calling `publishLecture` from a one-off `tsx` command. Do not touch production content.
  Acceptance: From `prd.md > Authoring: Generating Questions`: each atom has six questions, two per format, exactly one introductory; each has an explanation stating the idea in full plus one piece of context; the correct answer is not noticeably longer than the wrong ones; wrong answers do not use absolute language while the correct one is hedged; no long quotations from the lecture.
  Verify: Run `pnpm content list --lecture 1` and confirm 7 atoms with 6 questions each. Run `pnpm content export --lecture 1` and read five questions against the rules in `rules.md`. Report every lint warning in the final summary.

### The daily loop

- [x] **7. The signed-in shell shows the navbar with level, clout, inbox and sound toggle in the starting theme**
  Spec ref: `spec.md > Design System > Theme tokens`, `> Theme switching`, `> Starting theme`, `> Atom level looks`; `spec.md > App Shell` (all subsections); `spec.md > Queries`
  What to build: `src/app/theme.css` with every token group, `themes/starting.css`, the three fonts through `next/font/google`, and `data-theme` on `<html>`. `getHudValues`, `getNextDueDate`, creation of the `learner_state` row on first visit, `noteVisit` saving the time zone, `setSoundOn`. `HudProvider.tsx`, `Navbar.tsx`, `InboxButton.tsx`, `SoundToggle.tsx`, `AccountMenu.tsx`. The author link renders only for an admin.
  Acceptance: From `prd.md > Navigation Bar`: the navbar is on every signed-in page; username and avatar, or an initial; a badge with the session count only when atoms are due; "Nothing due" with the next date otherwise; learner level and clout shown; the app name returns to the courses view; the sound choice is remembered for the account.
  Verify: Run `pnpm dev`, sign in, and confirm the navbar shows clout 100 and learner level 1. Toggle sound, reload, and confirm the toggle kept its state. Run `grep -rnE "#[0-9a-fA-F]{3,8}" src/components` and confirm no output.

- [x] **8. The courses view and course view show all 24 lectures and Lecture 1's atoms**
  Spec ref: `spec.md > Course Screens > Courses view`, `> Course view`, `> Begin-review control`, `> Atom token`
  What to build: `getCoursesList`, `getCourseView`, `courses/page.tsx`, `courses/[courseSlug]/page.tsx`, `BeginReview.tsx`, `LectureRow.tsx` and `AtomToken.tsx` with its popover. The three lecture states: published and started, published and not started, draft with seven empty slots.
  Acceptance: From `prd.md > Courses View` and `> Course View`: today's date in large type; one course entry showing title, lecturer, "1 of 24 lectures" and atoms due; all 24 lectures in order; unpublished lectures greyed with placeholder slots and not clickable; each atom item's look changes with level; hovering or clicking an item shows its sentence, level, XP toward the next level and next due date.
  Verify: Run `pnpm dev`, open `/courses` and confirm the date and the course card. Open the course and confirm 24 rows, with Lecture 1 showing "Start Lecture 1" and the other 23 greyed.

- [x] **9. Starting Lecture 1 puts its seven atoms in the inbox**
  Spec ref: `spec.md > Course Screens > Start-lecture step`
  What to build: The start page, `StartLectureSteps.tsx`, `AtomList.tsx`, and the `startLecture` action inserting `lecture_progress` and one `atom_progress` row per active atom (interval 1 day, due today). "Not yet" returns to the course view with `?comeBack=1` and its one line.
  Acceptance: From `prd.md > Starting a Lecture`: the listen check with "Yes" and "Not yet"; "Not yet" adds nothing to the inbox; "Yes" leads to the atoms listed as sentences with "Begin"; "Begin" makes all atoms due now and starts the session; before this step the atoms do not count toward the badge.
  Verify: Run `pnpm dev`, press "Start Lecture 1", choose "Not yet" and confirm no badge. Start again, choose "Yes" then "Begin", and confirm the inbox badge shows 7.

- [x] **10. A review session shows one card at a time in all three formats with the confidence slider**
  Spec ref: `spec.md > Review Session > Session queue`, `> Session component`, `> Loading a card`, `> Picking a question`, `> Card`, `> Formats`, `> Confidence slider`
  What to build: `getSessionQueue` with `ensureAtomProgress`, `review/page.tsx`, the `loadCard` action, `ReviewSession.tsx`, `ReviewCard.tsx`, the three format components with `OptionButton.tsx` and its states, `ConfidenceSlider.tsx` and `StakeLine.tsx`. Confirm is disabled until something is chosen. Confirm does not submit yet.
  Acceptance: From `prd.md > Review Session`: every due atom once, most overdue first; cards remaining shown; the main atom is not named before answering; an atom's first card is its introductory question labelled "New"; options shuffled for multiple choice and multi-select; multi-select says more than one may be correct; the slider has Guess, Hunch, Sure and All in, starts at Hunch, and the card shows what the step would win and lose. The response from `loadCard` contains no `isCorrect`, explanation or atom sentence.
  Verify: Run `pnpm dev`, open `/review` and confirm a "New" card with a disabled Confirm. Move the slider and confirm the stake line changes. In the browser's network panel, confirm the `loadCard` response has no `isCorrect`.

- [x] **11. Answers are graded and saved on the server, and a missed atom returns until it is answered correctly**
  Spec ref: `spec.md > Review Session > Submitting an answer`, `> Retries`; `spec.md > Architecture Overview > Data flow: one answer`; `spec.md > Error Handling`
  What to build: The `submitAnswer` action with its ten steps in one transaction, Zod input checking, the `attemptId` guard, the two-tab guard, and the stored `result`. In `ReviewSession.tsx`: re-insert a missed atom three places later, skip `not_due` and `no_questions`, go to `/review/done` when the queue empties. The "Couldn't save. Try again." and "Couldn't load the next card" states, and busy states on Confirm and Continue. A minimal right-or-wrong result on the card is enough for this item.
  Acceptance: From `prd.md > Review Session`: XP, clout, interval and due date update at each answer; closing the tab and reopening shows what is still due, including a pending retry; answering from two tabs does not award XP twice; a retry is a different question on the same atom; the session does not end while a retry is outstanding. An answer cannot be changed once submitted.
  Verify: Run `pnpm dev`, answer one card wrong and confirm the atom returns later with a different question. Close the tab mid-session, reopen `/review`, and confirm the remaining cards and the retry are there. Query `review_event` in `dev` and confirm one row per answer.

- [ ] **12. Each answer shows the explanation, XP bars filling, level-ups and the clout change**
  Spec ref: `spec.md > Answer Feedback > Feedback panel`, `> XP bar and stack`, `> Level-up callout`, `> Clout change`
  What to build: `FeedbackPanel.tsx`, `XpBar.tsx`, `XpBarStack.tsx`, `LevelUpCallout.tsx`, `CloutChange.tsx` and `src/lib/useCountUp.ts`. Option buttons re-coloured correct, wrong and missed. The HUD provider updated from each result so the navbar's clout and badge change without a reload.
  Acceptance: From `prd.md > Answer Feedback and Scoring`: a correct answer turns green; the explanation and the main atom's sentence appear; the main atom's bar fills from its old value to its new one; linked atoms' bars stack beneath and fill in turn; clout counts up or down; a miss shows the correct answer and says the atom will come back; multi-select marks each option as correctly chosen, wrongly chosen or missed; each level-up is called out; nothing advances without Continue.
  Verify: Run `pnpm dev`, answer a question that has linked atoms correctly, and confirm stacked bars filling one after another and the navbar clout rising. Answer one wrong at Sure and confirm clout falls by 25 and no bar moves.

- [ ] **13. Sounds play for the five events and can be switched off; reduced motion is respected**
  Spec ref: `spec.md > Answer Feedback > Sounds`, `> Motion`
  What to build: `src/lib/sound.ts` with `playSound(name)`, five CC0 files from Kenney's audio packs in `public/sounds/` with `CREDITS.md`, and calls for correct, wrong, level-up (once per answer) and All in wipe. `src/lib/useReducedMotion.ts`; bars and counters jump to final values when it is on. All timing values come from theme tokens.
  Acceptance: From `prd.md > Sound and Motion`: sounds for correct, wrong (gentle), level-up, All in wipe and door unveiling exist; the navbar toggle turns all sound off; with sound off every event is still shown on screen; reduced motion hides nothing.
  Verify: Run `pnpm dev`, answer right and wrong with sound on and confirm two different sounds. Switch sound off and confirm silence with the same visuals. Turn on the system's reduce-motion setting and confirm bars jump to their final value.

- [ ] **14. The end screen lists what was earned today and draws the session map**
  Spec ref: `spec.md > End Screen > Today's summary`, `> Session map`
  What to build: `getTodaySummary` built from today's non-voided `review_event` rows, `review/done/page.tsx`, `SpoilsList.tsx`, `SessionTotals.tsx` and `SessionMap.tsx` as a hand-drawn SVG with no library. The "Keep going" and "Done for today" pair is added in item 19.
  Acceptance: From `prd.md > End Screen`: each atom reviewed with the XP it gained, counting up one after another; linked-only atoms listed separately; level-ups called out; clout change and new balance; trial door progress; the next due date; a map with a line between any two atoms that share a question; no battle wording; one control back to the course view; a resumed session is covered in full.
  Verify: Run `pnpm dev`, finish a session, and confirm the end screen lists every atom answered today with amounts and shows the map. Reload `/review/done` and confirm the same totals.

### Around the loop

- [ ] **15. The trial door shows its requirement and unveils once when every atom reaches Level 3**
  Spec ref: `spec.md > Course Screens > Trial door`
  What to build: `getDoorProgress` in `src/game/levels.ts` with a test, `TrialDoor.tsx`, `DoorUnveiling.tsx` as a full-screen overlay with the `door-unveil` sound, `doorJustOpened` handled after Continue, the `markDoorUnveiled` action, and the replay on the next course-view visit when opened but not unveiled. An open door shows "Coming soon."
  Acceptance: From the trial-door story in `prd.md > Course View`: the requirement in words and progress such as "4 of 7"; the unveiling plays once, with its own sound, the moment the requirement is met; afterwards the door says "Coming soon."; an open door never re-locks.
  Verify: In `dev`, set six atoms' XP to 40 and one to 30 with a one-off script, answer that atom correctly, and confirm the unveiling plays once. Reload the course view and confirm the door reads "Coming soon." and does not replay.

- [ ] **16. A flagged question leaves rotation and its answer is undone**
  Spec ref: `spec.md > Flagging`; `spec.md > Review Session > Flag control`
  What to build: `FlagControl.tsx` on the card and on the feedback panel, and the `flagQuestion` action: set status `flagged` with note, time and user; when an `attemptId` is given, void the event, subtract its XP from main and linked atoms, reverse its clout change, and restore the main atom from the `before` snapshot; return the next card for the same atom.
  Acceptance: From `prd.md > Flagging a Question`: the flag is available before and after answering; flagging removes the question at once; an answered question's XP, clout, interval and due date return to what they were; the atom is shown again with a different question as a first attempt; if it was the atom's only question the atom is skipped; the note is optional.
  Verify: Run `pnpm dev`, note clout and one atom's XP, answer its card, flag it from the feedback panel, and confirm both numbers are back to their earlier values and a different question appears.

- [ ] **17. The author page lists a lecture's atoms and questions, and every field can be edited and saved**
  Spec ref: `spec.md > Author Page > Routes`, `> Lecture editor`, `> Atom editor`, `> Question editor`, `> Admin server actions`
  What to build: `getAuthorLecture`, the three author routes with `requireAdmin()` in the layout, `FlaggedList.tsx`, `AtomEditor.tsx`, `QuestionEditor.tsx`, `OptionListEditor.tsx`, `LinkedAtomsEditor.tsx` and `SaveStatus.tsx`. The actions `saveAtom`, `retireAtom`, `deleteAtom`, `saveQuestion`, `addQuestion`, `deleteQuestion` and `unflagQuestion`, each starting with `requireAdmin()` and calling `src/content/`. Shape errors refuse the save with a message; lint warnings show and do not block.
  Acceptance: From `prd.md > Authoring: The Author Page and Publishing`: only the admin account can open it; flagged questions first with their notes; the atom sentence and every question field editable; add, delete and unflag work; each atom shows its counts and warns on no introductory question or fewer than three; a save shows "Saved"; a failed save says so and keeps the typed text.
  Verify: Run `pnpm dev`, open `/author/1`, change one question's prompt, press Save and confirm "Saved". Reload and confirm the change. Make a multiple choice question have two correct options and confirm the save is refused with the reason.

- [ ] **18. One action publishes a lecture, and edits never change progress**
  Spec ref: `spec.md > Author Page > Publishing`, `> Effects of edits on progress`
  What to build: `PublishBar.tsx` and the `publishLecture` action: refused with the atoms named when an active atom has no draft or active question; otherwise the lecture becomes `published` and its drafts `active`; "Publish drafts (N)" on an already-published lecture. Deleting a question sets status `deleted`. Retiring an atom removes it from sessions, the door requirement and the course view while its XP still counts toward the learner level. "Delete atom" only when no progress row has XP.
  Acceptance: From `prd.md > Authoring: The Author Page and Publishing`: publishing is one action for the whole lecture; it is refused with the reason if any atom has no questions; the lecture then shows "Start Lecture N"; edits take effect on the next card; editing wording or the correct option never changes XP, levels, intervals, due dates or past results.
  Verify: In `dev`, add an atom with no questions, press Publish and confirm the refusal names it. Add a draft question with `--append`, press "Publish drafts (1)", and confirm it becomes active. Edit a reviewed question's wording and confirm `atom_progress` is unchanged.

- [ ] **19. After seven days away, a welcome-back message offers a short session of five**
  Spec ref: `spec.md > Welcome-Back Flow`; `spec.md > End Screen > Today's summary` (the "Keep going" line)
  What to build: `noteVisit` setting `eased_return_on` when the gap since `last_review_on` is seven days or more; the queue and inbox badge capped at 5 minus first attempts made today unless `/review?all=1`; `WelcomeBack.tsx` with `dismissWelcome`; "Keep going" beside an equally prominent "Done for today" on the end screen while atoms remain due.
  Acceptance: From `prd.md > Returning After a Gap`: the message greets the learner, says where they are, and names anything published since; one button starts about five atoms, most overdue first; the badge shows the short count; declining "Keep going" is as easy as accepting; no "overdue", streak or red backlog total; XP, levels and clout unchanged; shown once per return and dismissible.
  Verify: In `dev`, set `last_review_on` to ten days ago with all seven atoms due, reload, and confirm the message and a badge of 5. Finish the five and confirm the end screen offers "Keep going" and "Done for today".

- [ ] **20. A question can show a credited image, and a missing image never breaks the card**
  Spec ref: `spec.md > Review Session > Question image`; `spec.md > Content Pipeline > Images`
  What to build: `QuestionImage.tsx` as a plain `<img>` with the credit line, removing itself and its credit on a load error. The image path, credit and kind fields on the question editor. `public/question-images/` with at least two Wikimedia Commons or other open-access images added to Lecture 1 questions in `dev`, each viewed, with source and licence in the credit.
  Acceptance: From the images story in `prd.md > Review Session`: a question may have one image; a question without one looks complete; every image shows a credit line; no images from the Great Courses materials; if an image fails to load the card is still answerable.
  Verify: Run `pnpm dev`, review until an image card appears and confirm the image and credit. Set one question's path to a file that does not exist and confirm the card shows no gap and can be answered.

- [ ] **21. The theme playground shows every component in every state**
  Spec ref: `spec.md > Design System > Theme playground`, `> Starting theme`
  What to build: `(signed-in)/theme/page.tsx`, admin only, with fixed sample data: option buttons in six states, the slider at each step, XP bars at several fills, all five level looks, the navbar, a feedback panel right and wrong, the door locked and open. Check every option state against the 4.5 to 1 contrast rule and fix the starting theme's tokens where it fails.
  Acceptance: From the legibility criterion in `prd.md > Review Session`: text on every button and option is easy to read in every state: resting, hovered, chosen, correct, wrong. Levels can be told apart without reading a number.
  Verify: Run `pnpm dev`, open `/theme`, and confirm every listed component appears. Change `--color-accent-1` in `themes/starting.css`, save, and confirm the page changes with no component edits. Record the measured contrast ratios in the final summary.

### Launch

- [ ] **22. Production holds Lecture 1, Joe has published it, and the first real review is done**
  Spec ref: `prd.md > What We're Building`; `spec.md > Runtime & Deployment > One-time setup` (step 7); `spec.md > Content Pipeline > Lecture 1 content`
  What to build: Run `pnpm db:migrate:prod` and confirm the seed in production. Load the seven atoms and the 42 questions into production with `pnpm content:prod`, as drafts. Save a backup with `pnpm content:prod export --lecture 1` into `docs/content-backups/`. Write `README.md`: what the app is, how to run it, the scripts, the two skills. Copy the final `docs/` and `process-notes.md` into the app repo. Then stop for Joe: he reads and edits the questions on `/author/1`, presses "Publish lecture", starts Lecture 1 and reviews. Report in the final summary every item skipped, every default taken, and everything still waiting on Joe.
  Acceptance: All thirteen points in `prd.md > What We're Building` work for Joe's account on the Vercel address with Lecture 1's seven atoms. Nothing is visible to a learner before Joe publishes.
  Verify: Open the Vercel address, sign in, and confirm Lecture 1 shows no "Start" button before publishing. After Joe publishes, confirm "Start Lecture 1" appears, complete a seven-card session, and confirm the end screen and an inbox with nothing due.
