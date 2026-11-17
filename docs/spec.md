# Flashbang: Athenian Democracy (working title) — Technical Spec

> Written 2026-11-16 from the /spec conversation. Implements **Stage 1** of `docs/prd.md`.
> Items marked *(default)* were chosen by Claude and not discussed with Joe. Everything else was stated or accepted by Joe.
> Where this spec gives a number or a rule that the PRD left as a placeholder, this spec wins. Where it is silent, the PRD's acceptance criteria are the requirement.
> Joe's standing notes: (1) the two authoring skills are **first drafts**, to be designed iteratively once the app exists; (2) the look ships as a plain **starting theme**, and palette and type play happens after the skeleton works.

## Stack

One project, one database, one host. Chosen for the least plumbing: Joe's backend knowledge is rusty by his own account, he has used Postgres and Neon before, and he liked Vercel.

| Piece | Choice | Version checked 2026-11-16 | Docs |
|---|---|---|---|
| Language | TypeScript, loose typing while prototyping | | |
| Framework | Next.js, App Router, server actions | `next` 16.4.6 | https://nextjs.org/docs/app |
| UI | React (ships with Next.js) | | https://react.dev |
| Styling | Tailwind CSS v4, theme as CSS variables | `tailwindcss` 4.3.5 | https://tailwindcss.com/docs/theme |
| Sign-in | Better Auth, self-hosted, Google provider | `better-auth` 1.7.25 | https://www.better-auth.com/docs |
| Database | Neon Postgres | | https://neon.com/docs |
| Database access | Drizzle ORM + Drizzle Kit | `drizzle-orm` 0.45.4, `drizzle-kit` 0.31.11 | https://orm.drizzle.team/docs |
| Database driver | Neon serverless driver | `@neondatabase/serverless` 1.2.1 | https://neon.com/docs/serverless/serverless-driver |
| Input checking | Zod | `zod` 4.6.7 | https://zod.dev |
| Tests | Vitest, for `src/game/` only | `vitest` 5.1.0 | https://vitest.dev |
| Scripts | `tsx` to run TypeScript scripts | | https://tsx.is |
| Package manager | `pnpm` | | |

Style rules for all code (Joe's): functional, no classes; long readable names; many files under 100 lines.

Not used, on purpose: Drizzle 1.0 (still a release candidate), FSRS / `ts-fsrs` (see `Key Technical Decisions`), any animation library, any graph library, any component library.

**Next.js 16 points the build agent must respect** (check https://nextjs.org/docs/app/guides/upgrading/version-16 before writing code): `params`, `searchParams`, `cookies()` and `headers()` are asynchronous and must be awaited; the file once called `middleware.ts` is now `proxy.ts`. This spec uses no proxy file.

## Runtime & Deployment

- **Runs:** as a website. Laptop first; layouts must not break at narrow widths, with no phone-specific work.
- **Host:** Vercel, Hobby plan, free `*.vercel.app` address for Stage 1. A custom domain comes later.
- **Node:** 22 or later, locally and on Vercel.
- **Repo:** a new repo, working name `flashbang`, at `~/Developer/flashbang`. This repo (`athenian-democracy`) stays the source library. `docs/` and `process-notes.md` are copied over when the new repo is created.

### Environments

| Environment | App address | Database | Used for |
|---|---|---|---|
| Local | `http://localhost:3000` | Neon branch `dev` | Building and trying things |
| Production | the Vercel address | Neon branch `main` | Joe's real daily review |

Neon branches are separate copies of the database inside one Neon project: https://neon.com/docs/introduction/branching

### Environment variables

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Neon connection string (pooled). Set by the Vercel–Neon integration in production; the `dev` branch's string goes in `.env.local`. |
| `BETTER_AUTH_SECRET` | Random secret that signs sessions. Different in each environment. |
| `BETTER_AUTH_URL` | The app's own address in that environment. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | From the Google Cloud OAuth client. |
| `ALLOWED_EMAILS` | Comma-separated emails let into the app. Stage 1: Joe's only. |
| `ADMIN_EMAILS` | Comma-separated emails that see the author page. Stage 1: Joe's only. |

Local files: `.env.local` (dev branch) and `.env.production.local` (production database address only, used by the content script). Both are git-ignored. `.env.example` lists the names with no values.

### One-time setup

1. Create the repo with `pnpm create next-app` (TypeScript, App Router, Tailwind, `src/` directory).
2. Create the Vercel project from the repo.
3. Add Neon from the Vercel Marketplace; it creates the database and sets `DATABASE_URL`. https://neon.com/docs/guides/vercel-managed-integration
4. In Neon, create a `dev` branch; put its connection string in `.env.local`.
5. In Google Cloud Console (https://console.cloud.google.com/apis/credentials) create an OAuth client of type "Web application" with two authorised redirect addresses: `http://localhost:3000/api/auth/callback/google` and `https://<vercel-address>/api/auth/callback/google`.
6. Set the environment variables above in Vercel and locally.
7. `pnpm db:migrate` against each branch, then `pnpm db:seed`.

### Package scripts

| Script | Does |
|---|---|
| `pnpm dev` | Runs the app locally |
| `pnpm test` | Runs the `src/game/` tests |
| `pnpm db:generate` | Writes a migration from the table definitions |
| `pnpm db:migrate` | Applies migrations to the `dev` branch |
| `pnpm db:migrate:prod` | Applies migrations to production |
| `pnpm db:seed` | Inserts the course and its 24 lecture titles |
| `pnpm content <command>` | Content script against `dev` |
| `pnpm content:prod <command>` | Content script against production |

Migrations are run by hand, not during deploy *(default)*.

## Architecture Overview

```
┌──────────────────────────┐        ┌───────────────────────────────┐
│ Browser                  │        │ Claude Code (Joe's laptop)    │
│ React pages + components │        │ skills: lecture-conversation, │
│ sound, animation         │        │         generate-questions    │
└────────────┬─────────────┘        └──────────────┬────────────────┘
             │ server actions                      │ pnpm content …
             ▼                                     ▼
┌──────────────────────────────────┐   ┌──────────────────────────┐
│ Next.js on Vercel                │   │ scripts/content.ts       │
│  src/server/access   who are you │   │ validates JSON, inserts  │
│  src/server/actions  writes      │◄──┤ drafts using the same    │
│  src/server/queries  reads       │   │ src/content functions    │
│  src/game            the rules   │   └────────────┬─────────────┘
│  Better Auth ───────────► Google │                │
└────────────┬─────────────────────┘                │
             ▼                                      ▼
┌──────────────────────────────────────────────────────────────────┐
│ Neon Postgres: users · course content · progress · answer log    │
└──────────────────────────────────────────────────────────────────┘
```

Four rules hold everywhere:

1. **The database is the only source of truth** for content and progress. There are no content files.
2. **The server grades.** Which options are correct, and the explanation, are never sent to the browser before an answer is submitted.
3. **`src/game/` is plain functions.** No database, no React, no clock: the date is passed in. Everything in it is unit-tested.
4. **Every server action checks access itself.** A page layout that requires sign-in does not protect the actions called from it.

### Data flow: one answer

```
Card shown ── browser makes an attemptId (random id) for this showing
   │
You press Confirm
   │  submitAnswer({ attemptId, questionId, chosenOptionIds, confidenceStep })
   ▼
requireLearner()                         signed in and on the allowed list?
   ▼
one database transaction ───────────────────────────────────────────┐
   read question, atom_progress, learner_state                      │
   decide: first attempt, retry, or not due (the server decides)    │
   grade chosenOptionIds against the stored options                 │
   scoreAnswer(…) from src/game  → XP, interval, due date, clout    │
   insert review_event (unique attemptId: a repeat returns the      │
     stored result and changes nothing)                             │
   update atom_progress (main + linked), learner_state,             │
     lecture_progress if the door just opened                       │
────────────────────────────────────────────────────────────────────┘
   ▼
returns: correct option ids, explanation, main atom sentence,
         XP bars (before → after, main then linked), level-ups,
         clout before → after, doorJustOpened
   ▼
Card turns green or marks the miss, bars fill, clout counts, sound plays
```

### Data flow: content

```
lecture-conversation skill ─► pnpm content add-atoms      ─► atom rows
generate-questions skill   ─► pnpm content add-questions  ─► question rows, status "draft"
Joe on /author/1           ─► edits, then Publish lecture ─► lecture "published", drafts "active"
Learner on course view     ─► Start Lecture 1             ─► atom_progress rows, due today
```

## Sign-In and Access

PRD ref: `prd.md > Signing In`, and the admin-only criteria in `prd.md > Navigation Bar` and `prd.md > Authoring: The Author Page and Publishing`.

### Better Auth setup

File `src/server/auth.ts`. Docs: https://www.better-auth.com/docs/installation · https://www.better-auth.com/docs/integrations/next · https://www.better-auth.com/docs/authentication/google · https://www.better-auth.com/docs/adapters/drizzle

```ts
export const auth = betterAuth({
  database: drizzleAdapter(database, { provider: "pg" }),
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
  },
  plugins: [nextCookies()],
});
```

- Route file `src/app/api/auth/[...all]/route.ts` exports `toNextJsHandler(auth)`.
- Browser side, `src/lib/authClient.ts` exports `createAuthClient()` from `better-auth/react`.
- Better Auth's tables (`user`, `session`, `account`, `verification`) are generated with its command-line tool into `src/server/db/schema/auth.ts`; do not hand-write them.
- No email-and-password sign-in. No passwords are stored anywhere.
- Sessions are Better Auth's default cookie sessions, which keep Joe signed in across browser restarts.

### Sign-in page

`src/app/page.tsx`. Shows the app name and one "Continue with Google" button, nothing else.

- The button calls `authClient.signIn.social({ provider: "google", callbackURL: "/courses", errorCallbackURL: "/?signin=failed" })`.
- If `?signin=failed` is present, show one line: "Sign-in did not complete." The button still works.
- A visitor who is already signed in and allowed is sent to `/courses`.

### Access rules

File `src/server/access.ts`. Three functions, used by layouts and by every server action:

| Function | Returns | If not satisfied |
|---|---|---|
| `getSignedInUser()` | the session's user, or nothing | |
| `requireLearner()` | the user, if their Google-verified email is in `ALLOWED_EMAILS` | signed out → redirect `/`; not allowed → redirect `/not-open` |
| `requireAdmin()` | the user, if also in `ADMIN_EMAILS` | redirect `/courses` (pages) or throw (actions) |

- Emails are compared lower-cased and trimmed. An account whose email Google has not verified is treated as not allowed.
- `src/app/(signed-in)/layout.tsx` calls `requireLearner()`, so every inner address leads to sign-in or "not open yet" for anyone else.
- `src/app/(signed-in)/author/layout.tsx` calls `requireAdmin()`.

### Not-open page

`src/app/not-open/page.tsx`. One sentence ("This isn't open yet.") and a sign-out control. No fields, no links into the app.

### Sign-out

In the navbar's account menu: `authClient.signOut()` then go to `/`.

## App Shell

### Signed-in layout

`src/app/(signed-in)/layout.tsx`. After `requireLearner()` it loads the heads-up values with `getHudValues()` and renders the HUD provider, the navbar, the welcome-back message when it applies, and the page.

### HUD provider

`src/components/hud/HudProvider.tsx`. A small React context holding `{ clout, learnerLevel, totalXp, dueCount, soundOn }`, initialised from the server and updated in the browser from each `submitAnswer` result. This lets the navbar's clout and badge change during a session without reloading the page.

### Navbar

PRD ref: `prd.md > Navigation Bar`. `src/components/navbar/`.

| Part | Behaviour |
|---|---|
| App name | Links to `/courses` |
| Learner level, clout | From the HUD provider |
| Inbox | Badge with the next session's atom count when above zero; no badge at zero. Click: go to `/review` when something is due; otherwise a small popover: "Nothing due. Next: <date>" |
| Speaker toggle | Calls `setSoundOn`; stored in `learner_state.sound_on` |
| Username and avatar | From the Google account; a circle with the first initial if there is no picture. Opens the account menu (sign out) |
| Author link | Rendered only when the user is an admin |

## Course Screens

### Courses view

PRD ref: `prd.md > Courses View`. `src/app/(signed-in)/courses/page.tsx`.

Today's date in large type; the `BeginReview` component; one card per course showing title, lecturer, "1 of 24 lectures", and atoms due.

### Course view

PRD ref: `prd.md > Course View`. `src/app/(signed-in)/courses/[courseSlug]/page.tsx`. Data from `getCourseView(userId, courseSlug)`.

- All 24 lectures in order.
- **Published and started:** a row of atom tokens, a due count, the trial door.
- **Published, not started:** a "Start Lecture N" button linking to the start step.
- **Draft:** number and title greyed, a row of empty token slots, not clickable. *(default: seven slots per unpublished lecture, since the real count is unknown until its conversation happens.)*

### Begin-review control

`src/components/course/BeginReview.tsx`, used on both views. Shows "Begin review (N)" linking to `/review` when N is above zero; otherwise "Nothing due" and the next due date.

### Atom token

`src/components/course/AtomToken.tsx`. A small square whose look is set by the atom's level (see `Design System > Atom level looks`). Hover or click opens a popover with the sentence, level, XP toward the next level, and next due date.

### Trial door

PRD ref: the trial-door story in `prd.md > Course View`. `src/components/course/TrialDoor.tsx` and `DoorUnveiling.tsx`.

- Requirement text and progress come from `getDoorProgress` in `src/game/levels.ts`: "All 7 atoms at Level 3 · 4 of 7".
- `submitAnswer` sets `lecture_progress.door_opened_at` in the same transaction as the answer that meets the requirement, and returns `doorJustOpened`.
- The unveiling is a full-screen overlay with its own sound. It plays after the learner presses Continue on that card, then the session carries on *(default)*. When it finishes, `markDoorUnveiled` sets `door_unveiled_at`.
- If the tab closed before it played, it plays on the next visit to the course view (opened but not unveiled).
- An opened door, when clicked, shows "Coming soon." It can never re-lock.

### Start-lecture step

PRD ref: `prd.md > Starting a Lecture`. `src/app/(signed-in)/courses/[courseSlug]/lectures/[lectureNumber]/start/page.tsx` with `src/components/start/StartLectureSteps.tsx`.

Two steps inside one component: the listen check, then the atom list with "Begin".

- "Not yet" returns to the course view with `?comeBack=1`, which shows one line asking them to return after listening.
- "Begin" calls `startLecture(lectureId)`: it inserts `lecture_progress` and one `atom_progress` row per active atom (interval 1 day, due today), then goes to `/review`.
- The atom list is one component, `AtomList.tsx`, so the Stage 2 intake can replace it without touching the listen check or `startLecture`.

## Review Session

PRD ref: `prd.md > Review Session`.

### Session queue

`src/app/(signed-in)/review/page.tsx` calls `getSessionQueue(userId, { all })` and passes the result to the browser. The queue is a list of atom ids only; it carries no question content.

- An atom is in the queue if its lecture is started, the atom is active, it has at least one active question, and either it is due (`due_on` is today or earlier) or it has a retry pending.
- Order: most overdue first; retry-pending atoms that are not due go last.
- Before building, `ensureAtomProgress` creates missing progress rows (due today) for atoms added to an already-started lecture *(default)*.
- The eased-return cap may shorten the queue: see `Welcome-Back Flow`.
- If the queue is empty, the page redirects to `/courses`.

### Session component

`src/components/review/ReviewSession.tsx`. Holds the queue in browser state and ignores later prop changes.

For the atom at the front it calls `loadCard(atomId)`, shows the card, and on Continue moves on. On a wrong result it re-inserts that atom three places later, or at the end if fewer than three cards remain *(default: three)*. "Cards remaining" is the queue length. When the queue empties it goes to `/review/done`.

Nothing about the session is stored in the browser. Closing the tab and returning rebuilds the queue from the database.

### Loading a card

Server action `loadCard(atomId)` in `src/server/actions/loadCard.ts`.

1. `requireLearner()`.
2. Decide the kind: first attempt if the atom is due; retry if not due but `retry_pending`; otherwise return `{ kind: "not_due" }` and the session skips it.
3. Pick a question with `pickQuestion` (below).
4. Return `{ kind, isNew, questionId, format, prompt, options: [{ id, text }], image }`. Options are shuffled here for multiple choice and multi-select; true/false stays True then False. **No `isCorrect`, no explanation, no atom sentence.**
5. If the atom has no active question, return `{ kind: "no_questions" }`; the session skips it.

### Picking a question

`src/game/pickQuestion.ts`, a plain function of the atom's active questions, its review count, the last question shown, and when each question was last answered.

- Review count zero and an active introductory question exists → that question; the card is labelled "New".
- Otherwise the least recently answered active question, never-answered first, excluding the last one shown when there is more than one.
- One question only → that question.

A retry uses the same function, so it gets a different question from the one just missed where one exists.

### Card

`src/components/review/ReviewCard.tsx` lays out: the "New" label if any, the image, the prompt, the options for the format, the confidence slider with its stake line, Confirm, and the flag control.

### Formats

`src/components/review/formats/`. One file each: `MultipleChoiceOptions.tsx`, `MultiSelectOptions.tsx` (shows "More than one may be correct"), `TrueFalseOptions.tsx`. They share `OptionButton.tsx`, which has five visual states: resting, hovered, chosen, correct, wrong, plus "missed" for multi-select feedback.

Confirm is disabled until something is chosen. After submission the options are locked.

### Confidence slider

PRD ref: the confidence story in `prd.md > Review Session`. `src/components/review/ConfidenceSlider.tsx`.

A real range input with four positions labelled Guess, Hunch, Sure, All in. Starts at Hunch on every card. `StakeLine.tsx` beneath it shows what the current step would win and lose at the current clout, computed in the browser by `src/game/clout.ts`.

### Question image

`src/components/review/QuestionImage.tsx`. A plain `<img>` with the credit line beneath. If it fails to load it removes itself and its credit; the card stays answerable. See `Images` for where files live.

### Submitting an answer

Server action `submitAnswer` in `src/server/actions/submitAnswer.ts`. PRD ref: the per-card saving and retry stories in `prd.md > Review Session`, and `prd.md > Answer Feedback and Scoring`.

Input: `{ attemptId, questionId, chosenOptionIds, confidenceStep }`, checked with Zod.

Inside one transaction:

1. If a `review_event` with this `attemptId` exists, return its stored result. This makes a double click or a "try again" after a network failure safe.
2. Load the question, its main atom's progress, linked atoms' progress, and learner state.
3. Decide the kind exactly as `loadCard` does. If not due and no retry pending, return `{ kind: "not_due" }` and write nothing. This is the two-tab guard.
4. Grade: correct when the set of chosen ids equals the set of ids stored as correct.
5. Call `scoreAnswer`.
6. Insert the `review_event` with the amounts changed and a snapshot of the values before.
7. Update the main atom's progress (XP, and for a first attempt: interval, due date, review count, last reviewed; `retry_pending` true after a wrong first attempt, false after a correct retry; last question shown).
8. Add linked XP to each linked atom that has a progress row. Linked atoms without one are skipped *(default)*.
9. Update learner state: clout, and for a first attempt `last_review_on`.
10. If every active atom in the lecture is now at the door level and the door is not open, set `door_opened_at`.

The result is also stored on the event row (`result` column) so step 1 can return it unchanged.

### Retries

- After a wrong first attempt the atom's due date has already moved to a future day, and `retry_pending` is true. That flag is what keeps it in the session.
- A wrong retry leaves the flag true; the session re-inserts the atom again.
- If the learner leaves and returns the same day, the atom is in the queue as a retry.
- If they return on a later day when the atom is due again, it is shown as a first attempt and the flag is cleared by that answer *(default)*.

### Flag control

`src/components/review/FlagControl.tsx`, on the card before answering and on the feedback after. Opens a small box with an optional note and "Flag". Behaviour in `Flagging`.

## Scoring Rules

PRD ref: the scoring tables in `prd.md > Answer Feedback and Scoring`. All of this is in `src/game/`, with tests in `tests/game/`.

### Settings

`src/game/settings.ts` holds every number below as one exported object. Tuning is editing this file.

### XP

| Outcome | Main atom | Each linked atom |
|---|---|---|
| Correct first attempt | 10 + bonus (Guess 0, Hunch 2, Sure 4, All in 6) | round(main amount × link weight), at least 1 |
| Correct retry | 3 | 0 |
| Any wrong answer | 0 | 0 |

XP is an integer and never decreases.

### Levels

`src/game/levels.ts`.

| Level | Atom XP needed |
|---|---|
| 1 | 0 |
| 2 | 20 |
| 3 | 40 |
| 4 | 70 |
| 5 | 110 |

- Above Level 5, each further level needs 50 more XP.
- Level is always worked out from XP; it is not stored.
- Learner level = 1 + floor(total atom XP ÷ 100).
- Trial door requirement: every active atom in the lecture at Level 3.

**Changed from the conversation:** Joe accepted Level 3 at 45 XP. Checking the rules below showed that someone who always answers at Sure sees each atom less often and would reach 45 only on about day 12 to 16. At 40 XP every confidence step reaches Level 3 by day 8 with no misses. See `Open Issues`.

### Intervals and due dates

`src/game/nextInterval.ts`. Only a first attempt changes them.

| First attempt | Guess | Hunch | Sure / All in |
|---|---|---|---|
| Correct, atom never reviewed before | interval = 1 day | 1 day | 1 day |
| Correct, otherwise: interval × | 1.5 | 2.2 | 2.8 |
| Wrong: interval becomes | half | half | 1 day |

- Interval is stored as a decimal number of days and is never below 1.
- Due date = today's learner date + the interval rounded to the nearest whole day.
- With no misses, reviews fall on about day 0, 1, 3, 8 at Hunch; 0, 1, 4, 12 at Sure; 0, 1, 3, 5, 8 at Guess.

### Clout

`src/game/clout.ts`. A new learner starts with 100.

| Step | Correct first attempt | Wrong first attempt |
|---|---|---|
| Guess | +5 | 0 |
| Hunch | +10 | −5 |
| Sure | +25 | −25 |
| All in | balance doubles, and gains at least 25 | balance goes to 0 |

Clout never goes below zero. Retries do not change it.

### scoreAnswer

`src/game/scoreAnswer.ts`. One function that takes `{ kind, wasCorrect, confidenceStep, mainAtom: { xp, intervalDays, reviewCount }, linkedAtoms: [{ atomId, xp, weight }], clout, today }` and returns the new values, the amounts changed, and the level-ups (atoms and learner). It calls the three files above and does nothing else.

### What "today" means

`src/game/learnerDate.ts`. *(default)*

- The browser reports its time zone name; it is saved in `learner_state.time_zone` on each visit.
- The learner's date is the calendar date in that time zone, with the day starting at 04:00, so a review at 1 a.m. counts as the previous day.
- `due_on`, `last_review_on` and `review_event.learner_date` are all calendar dates of this kind.

## Answer Feedback

PRD ref: `prd.md > Answer Feedback and Scoring`.

### Feedback panel

`src/components/feedback/FeedbackPanel.tsx`, shown in place of the Confirm area once `submitAnswer` returns. In order: right or wrong banner; the options re-coloured (correct, wrong, missed); the explanation; the main atom's sentence; the XP bar stack; the clout change; on a miss, "This one will come back later in this session."; Continue; the flag control. Nothing advances on its own.

### XP bar and stack

`src/components/feedback/XpBar.tsx` and `XpBarStack.tsx`.

- A segmented bar with the atom's sentence (shortened), its level, and "XP / next threshold".
- It fills from the old value to the new one. If it passes a threshold it fills to the end, the level-up is called out, and it restarts from empty toward the next level.
- The stack shows the main atom's bar first, then each linked atom's, filling one after another.

### Level-up callout

`src/components/feedback/LevelUpCallout.tsx`. One callout per atom that levelled, and one for the learner level if it rose. Plays the level-up sound once per answer, not once per callout *(default)*.

### Clout change

`src/components/feedback/CloutChange.tsx`. Counts from the old balance to the new using `useCountUp`. An All in wipe gets its own sound and a stronger animation.

### Sounds

PRD ref: `prd.md > Sound and Motion`. `src/lib/sound.ts` exports `playSound(name)`, which does nothing when `soundOn` is false.

Five files in `public/sounds/`: `correct`, `wrong`, `level-up`, `all-in-wipe`, `door-unveil`. Source them from Kenney's CC0 audio packs (https://kenney.nl/assets/category/Audio) *(default)*; record each file's source in `public/sounds/CREDITS.md`.

### Motion

`src/lib/useReducedMotion.ts` reads the system setting. When it is on, bars and counters jump to their final values and the unveiling is a still panel. All timing values are CSS variables in the theme file.

## End Screen

PRD ref: `prd.md > End Screen`. `src/app/(signed-in)/review/done/page.tsx`, data from `getTodaySummary(userId)`.

### Today's summary

Built by adding up today's `review_event` rows that are not voided (so a resumed session is covered in full):

- atoms reviewed directly, each with XP gained today;
- atoms that only received linked XP, listed separately;
- level-ups, found by comparing each atom's level before its first event today with its level now;
- clout change and new balance;
- trial door progress;
- the next due date;
- if eased return applies and atoms are still due: a "Keep going" button to `/review?all=1` beside an equally prominent "Done for today".

Components in `src/components/end/`: `SpoilsList.tsx` (amounts count up one after another), `SessionTotals.tsx`, and `SessionMap.tsx`. Wording is about collecting, never about battle. One control returns to the course view.

### Session map

`src/components/end/SessionMap.tsx`. A hand-drawn SVG: today's atoms as points evenly spaced on a circle, with a line between two atoms when any active question involves both (as main and linked, or both linked). No library. This is the seed of the Stage 3 graph view.

## Welcome-Back Flow

PRD ref: `prd.md > Returning After a Gap`.

- On each signed-in page load, `noteVisit` compares today with `learner_state.last_review_on`. If the gap is seven days or more, it sets `eased_return_on` to today.
- While `eased_return_on` is today, the queue (and so the inbox badge) is capped at 5 minus the first attempts already made today, unless `/review?all=1` was asked for.
- `src/components/welcome/WelcomeBack.tsx` shows when `eased_return_on` is today and `welcome_dismissed_on` is not: a greeting, the lecture and learner level, anything published since `last_review_on`, and one button starting the short session. Dismissing it, or starting, sets `welcome_dismissed_on`.
- Copy never uses "overdue", streaks, or a red backlog total.

## Flagging

PRD ref: `prd.md > Flagging a Question`. Server action `flagQuestion({ questionId, note, attemptId })`.

1. Set the question's status to `flagged` and store the note, the time and the user. It is out of rotation at once.
2. If `attemptId` refers to an answer already given, undo it:
   - mark the event `voided`;
   - subtract the XP it gave from the main and linked atoms, and reverse its clout change;
   - restore the main atom's interval, due date, review count, retry flag and last question from the event's `before` snapshot.
3. Return the next card for the same atom via `loadCard`. It is a fresh first attempt, because the atom is due again.
4. If the atom has no other active question, the session skips it; the author page shows that atom as needing questions.

Unflagging on the author page sets the status back to `active`.

## Author Page

PRD ref: `prd.md > Authoring: The Author Page and Publishing`. Plain lists and text fields; legibility is the only design requirement.

### Routes

- `src/app/(signed-in)/author/page.tsx`: the lectures with their draft or published status.
- `src/app/(signed-in)/author/[lectureNumber]/page.tsx`: one lecture's editor.
- `src/app/(signed-in)/author/layout.tsx`: `requireAdmin()`.

### Lecture editor

In order: the Publish bar; flagged questions with their notes; then each atom with its questions beneath.

### Atom editor

`src/components/author/AtomEditor.tsx`. The sentence as a text field; counts by format; warnings when there is no introductory question or fewer than three active questions; "Retire atom" (allowed always) and "Delete atom" (only when no progress row has XP).

### Question editor

`src/components/author/QuestionEditor.tsx`, with `OptionListEditor.tsx` and `LinkedAtomsEditor.tsx`. Editable: prompt, each option's text and whether it is correct, add or remove an option, explanation, format, main atom, linked atoms and weights, image path, image credit, image kind, introductory. Also: status shown, Unflag, Delete.

- One Save button per question. `SaveStatus.tsx` shows "Saved" or "Save failed"; on failure the typed text stays in the fields.
- The save is refused with a message if the shape is invalid for the format (see `Content rules`).
- Lint warnings (see `Question lint`) are shown beside the question and do not block saving.
- Marking a question introductory unmarks any other introductory question on that atom.

### Publishing

`src/components/author/PublishBar.tsx` calls `publishLecture(lectureId)`.

- Refused, with the atoms named, if any active atom has no draft or active question.
- Otherwise: the lecture becomes `published` (with `published_at`) and every `draft` question in it becomes `active`.
- On an already-published lecture the same button reads "Publish drafts (N)" and activates new drafts.

### Effects of edits on progress

- Edits take effect on the next card loaded, because cards are read from the database each time.
- Editing wording or which option is correct never touches `atom_progress` or `review_event`. Past events keep their own `was_correct`.
- Deleting a question sets its status to `deleted`; the row and its events remain.
- Retiring an atom removes it from sessions, the door requirement and the course view; its XP still counts toward the learner level.

### Admin server actions

In `src/server/actions/author/`, each beginning with `requireAdmin()`: `saveAtom`, `retireAtom`, `deleteAtom`, `saveQuestion`, `addQuestion`, `deleteQuestion`, `unflagQuestion`, `publishLecture`. Each calls a function in `src/content/` so the content script shares the same rules.

## Content Pipeline

PRD ref: `prd.md > Authoring: The Post-Lecture Conversation` and `prd.md > Authoring: Generating Questions`.

### Content rules

`src/content/questionShape.ts` (Zod). Used by the author page and the content script.

- Multiple choice: 3 to 5 options, exactly one correct.
- Multi-select: 4 to 6 options, one or more correct.
- True/false: exactly two options with ids `true` and `false`, exactly one correct.
- Prompt and explanation are not empty. Link weights are above 0 and at most 1. A linked atom is not the main atom.
- An image path, if present, has a credit.

`src/content/questionSetShape.ts`: for a first generation, each atom gets exactly six questions, two per format, exactly one introductory.

### Question lint

`src/content/lintQuestion.ts`. Mechanical checks for Joe's two hard rules, returned as warnings *(default: the thresholds)*:

- the correct option is more than 1.3 times the length of the longest wrong option;
- a wrong option contains an absolute word (always, never, all, none, only, every, entirely, completely) and no correct option does.

The remaining generator rules in the PRD need judgment and are the skill's job.

### Content script

`scripts/content.ts`, run as `pnpm content <command>` (dev) or `pnpm content:prod <command>` (production). JSON is read from standard input. It talks to the database directly, through `src/content/`; there is no admin web endpoint.

| Command | Does |
|---|---|
| `list --lecture 1` | Prints the lecture's atoms with their ids, sentences and question counts |
| `add-atoms --lecture 1` | Inserts atoms: `[{ sentence, transcriptRef }]`. Prints the new ids |
| `add-questions --lecture 1` | Inserts draft questions after the set check (six per atom) and lint |
| `add-questions --lecture 1 --append` | Same, without the six-per-atom check, for topping up one atom |
| `export --lecture 1` | Prints all of the lecture's content as JSON, for a backup in git |

Question JSON: `{ mainAtomId, format, prompt, options: [{ text, isCorrect }], explanation, isIntroductory, linkedAtoms: [{ atomId, weight }], imagePath?, imageCredit?, imageKind? }`.

Lint warnings are printed; shape errors stop the whole batch and nothing is inserted.

### Seed script

`scripts/seedCourse.ts`. Inserts the course (*Athenian Democracy*, Robert Garland, slug `athenian-democracy`) and 24 draft lectures with number and title, taken from `guidebook.md` in the source library. Safe to run twice.

### Skill: lecture-conversation

`.claude/skills/lecture-conversation/SKILL.md`. **First draft; to be tuned iteratively.**

Runs the post-lecture conversation for a named lecture: walk through the facts, clear up confusion, then agree four to seven one-sentence atoms, each with a transcript reference, and note connections to earlier atoms (read with `pnpm content:prod list`). It ends by running `add-atoms`. Start from this repo's `study-lecture` skill and `lessons/STUDY-FLOW.md`, minus the artifact and rehearsal steps.

### Skill: generate-questions

`.claude/skills/generate-questions/`. **First draft; to be tuned iteratively.**

- `SKILL.md`: the procedure. Read the lecture's atoms and ids with `list`, read the transcript, write the set, check it against `rules.md`, run `add-questions`, report the lint warnings, and point Joe to `/author/N`.
- `rules.md`: the generator rules from `prd.md > Authoring: Generating Questions`, with Joe's two hard rules first. Joe edits this file.
- `examples.md`: good and bad example questions with a line on why. Joe adds to it.

### Source library access

Both skills read transcripts and the guidebook from the source library on Joe's laptop, at the path in `.claude/skills/source-library-path.txt` (`~/Developer/athenian-democracy`). Nothing from it is copied into the app repo or the database, apart from our own atoms and questions.

### Lecture 1 content

The seven atoms in `lessons/01/learning.md` (source library) go in with `add-atoms`, unchanged. The existing interactions in that file are not imported; `generate-questions` writes a fresh set of 42.

### Images

*(default)* Image files live in `public/question-images/` in the repo. A question stores the path, a credit line, and a kind (`sourced` or `generated`). Adding an image means committing the file and deploying; the author page edits only the path, credit and kind. Sources allowed: Wikimedia Commons (https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia), other public-domain or open-access collections, or generated images, whose credit reads "Generated illustration". Images are last in the PRD's cut order; build this last.

## Design System

PRD ref: the legibility criterion in `prd.md > Review Session`; the level-look criteria in `prd.md > Course View` and `prd.md > Answer Feedback and Scoring`; the PRD's open question on the look.

Direction (Joe): 90s utopian scholastic, JRPG dynamics, a little brutalism. The skeleton ships in the starting theme below with no polish; palette and type play is its own later step.

### Theme tokens

`src/app/theme.css`. Every colour, font, border width, corner radius, shadow and animation time is a named CSS variable inside Tailwind's `@theme` block. **Components use only these names; a raw colour value in a component is a defect.**

Token groups: `page`, `panel`, `ink`, `outline`, `accent-1` to `accent-4`, `correct`, `wrong`, `missed`, `xp`, `clout`, `level-1` to `level-5` (fill, edge, ink for each), `font-display`, `font-body`, `font-number`, `border-thick`, `shadow-hard`, `radius`, `time-fast`, `time-slow`.

### Theme switching

A theme is a block of overrides under `[data-theme="name"]` in `src/app/themes/`. The `<html>` element carries the attribute. Stage 1 ships one theme, `starting`; adding another is adding one file.

### Starting theme

| Element | Look |
|---|---|
| Page | Cream paper; flat saturated primaries: book-fair red, school-bus yellow, teal, cobalt |
| Panels, buttons | Thick black outline, hard offset shadow, square corners, no gradients |
| Card and feedback | Framed menu-window panels |
| XP bar | Segmented; fills in steps |
| Type | Archivo Black for headings, Atkinson Hyperlegible for body, Silkscreen for numbers only, loaded with `next/font/google` *(default: the three faces)* |

Text on every option state must reach a contrast ratio of 4.5 to 1.

### Atom level looks

Same shape at every level; the material changes: Level 1 paper, 2 bronze, 3 silver, 4 gold, 5 and above prismatic. Each is three tokens (fill, edge, ink), used by the atom token, the XP bar and the level-up callout.

### Theme playground

`src/app/(signed-in)/theme/page.tsx`, admin only. One screen showing every component in every state with fixed sample data: option buttons (six states), the slider at each step, XP bars at several fills, all five level looks, the navbar, a feedback panel right and wrong, the door locked and open. It is where palettes are tried and where the contrast rule is checked.

## Data Model

Table definitions in `src/server/db/schema/`, one file per group. Ids are text UUIDs made with `crypto.randomUUID()`. Docs: https://orm.drizzle.team/docs/sql-schema-declaration

### Database client

`src/server/db/client.ts`. Drizzle over the Neon serverless driver's `Pool` (`drizzle-orm/neon-serverless`), because `submitAnswer` and `flagQuestion` need real transactions, which the HTTP mode does not provide. Docs: https://orm.drizzle.team/docs/connect-neon · https://orm.drizzle.team/docs/transactions

### Auth tables

`user`, `session`, `account`, `verification`: generated by Better Auth. `user.id` is what every other table refers to.

### course

`id`, `slug` (unique), `title`, `lecturer`, `lecture_count`.

### lecture

`id`, `course_id`, `number`, `title`, `status` (`draft` | `published`), `published_at`. Unique on course and number.

### atom

`id`, `lecture_id`, `position`, `sentence`, `transcript_ref`, `status` (`active` | `retired`), `created_at`.

### question

`id`, `main_atom_id`, `format` (`multiple_choice` | `multi_select` | `true_false`), `prompt`, `options` (JSON list of `{ id, text, isCorrect }`), `explanation`, `is_introductory`, `image_path`, `image_credit`, `image_kind`, `status` (`draft` | `active` | `flagged` | `deleted`), `flag_note`, `flagged_at`, `flagged_by_user_id`, `created_at`, `updated_at`.

### question_link

`question_id`, `atom_id`, `weight`. Primary key on the pair.

### atom_progress

One row per learner per atom, created by `startLecture`.

`user_id`, `atom_id` (primary key on the pair), `xp`, `interval_days`, `due_on`, `review_count` (first attempts only), `last_reviewed_on`, `retry_pending`, `last_question_id`.

### learner_state

One row per learner, created on first signed-in visit.

`user_id` (primary key), `clout` (starts 100), `sound_on` (starts true), `time_zone`, `last_review_on`, `eased_return_on`, `welcome_dismissed_on`.

### lecture_progress

`user_id`, `lecture_id` (primary key on the pair), `started_at`, `door_opened_at`, `door_unveiled_at`.

### review_event

One row per answer. Rows are never edited except to set `voided`.

`id`, `attempt_id` (unique), `user_id`, `question_id`, `main_atom_id`, `kind` (`first` | `retry`), `confidence_step`, `chosen_option_ids`, `was_correct`, `main_xp_gained`, `linked_xp_gained` (JSON list of `{ atomId, xp }`), `clout_change`, `before` (JSON snapshot: main atom's xp, interval, due date, review count, retry flag, last question; clout), `result` (JSON: exactly what `submitAnswer` returned), `learner_date`, `answered_at`, `voided`.

It serves the flag undo, the end screen, question rotation, the double-submit guard, and any later retuning or change of scheduler by replaying history.

### Where each piece of state lives

| State | Stored in | Survives closing the tab |
|---|---|---|
| Content, drafts, flags | `atom`, `question`, `question_link`, `lecture` | Yes |
| XP, interval, due date, retry pending | `atom_progress` | Yes |
| Clout, sound setting, time zone, return state | `learner_state` | Yes |
| Lecture started, door state | `lecture_progress` | Yes |
| Every answer | `review_event` | Yes |
| Session queue order, current card, chosen options, slider position | Browser memory | No; rebuilt from the database |
| Signed-in session | Better Auth cookie and `session` table | Yes |

Nothing uses the browser's local storage.

## Queries

`src/server/queries/`, one function per file, all read-only: `getHudValues`, `getCoursesList`, `getCourseView`, `getSessionQueue`, `getTodaySummary`, `getAuthorLecture`, `getNextDueDate`.

## Error Handling

The places most likely to fail in daily use:

| Failure | Behaviour |
|---|---|
| `submitAnswer` fails or times out | The card keeps the chosen answer locked and shows "Couldn't save. Try again." Retrying sends the same `attemptId`, so it can never count twice |
| `loadCard` fails | "Couldn't load the next card" with a retry button; the queue is unchanged |
| Database slow to wake (Neon pauses when idle) | The Confirm and Continue buttons show a busy state; no timeout shorter than 10 seconds |
| Image missing | The image and its credit disappear; the card works |
| Sound blocked by the browser | Ignored silently |
| Author save fails | "Save failed"; typed text kept |
| Google sign-in cancelled | Back on the sign-in page with the one-line message |

## Tests

`tests/game/`, Vitest, plain functions only: `scoreAnswer.test.ts`, `nextInterval.test.ts`, `levels.test.ts`, `clout.test.ts`, `pickQuestion.test.ts`, `learnerDate.test.ts`, and `tests/content/lintQuestion.test.ts`. One required test replays a no-miss learner at each confidence step and asserts Level 3 by day 14, which guards the trial-door criterion when numbers are retuned.

No browser tests in Stage 1.

## File Structure

```
flashbang/
├── .claude/skills/
│   ├── source-library-path.txt          # where transcripts live on Joe's laptop
│   ├── lecture-conversation/SKILL.md    # post-lecture talk → atoms (first draft)
│   └── generate-questions/
│       ├── SKILL.md                     # procedure (first draft)
│       ├── rules.md                     # generator rules; Joe edits
│       └── examples.md                  # good and bad examples; Joe edits
├── docs/                                # scope, prd, spec, checklist, scoring diagram
├── process-notes.md
├── drizzle/                             # generated migrations
├── drizzle.config.ts
├── public/
│   ├── sounds/                          # five sound files + CREDITS.md
│   └── question-images/                 # credited images
├── scripts/
│   ├── content.ts                       # command-line entry: parses the command
│   ├── contentCommands/                 # list.ts, addAtoms.ts, addQuestions.ts, exportLecture.ts
│   └── seedCourse.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # html, fonts, data-theme
│   │   ├── theme.css                    # every design token
│   │   ├── themes/starting.css
│   │   ├── page.tsx                     # sign-in
│   │   ├── not-open/page.tsx
│   │   ├── api/auth/[...all]/route.ts   # Better Auth
│   │   └── (signed-in)/
│   │       ├── layout.tsx               # requireLearner, HUD, navbar, welcome-back
│   │       ├── courses/page.tsx
│   │       ├── courses/[courseSlug]/page.tsx
│   │       ├── courses/[courseSlug]/lectures/[lectureNumber]/start/page.tsx
│   │       ├── review/page.tsx
│   │       ├── review/done/page.tsx
│   │       ├── theme/page.tsx           # playground, admin only
│   │       └── author/
│   │           ├── layout.tsx           # requireAdmin
│   │           ├── page.tsx
│   │           └── [lectureNumber]/page.tsx
│   ├── components/
│   │   ├── hud/         HudProvider.tsx
│   │   ├── navbar/      Navbar.tsx, InboxButton.tsx, SoundToggle.tsx, AccountMenu.tsx
│   │   ├── course/      BeginReview.tsx, LectureRow.tsx, AtomToken.tsx, TrialDoor.tsx, DoorUnveiling.tsx
│   │   ├── start/       StartLectureSteps.tsx, AtomList.tsx
│   │   ├── review/      ReviewSession.tsx, ReviewCard.tsx, ConfidenceSlider.tsx, StakeLine.tsx,
│   │   │                QuestionImage.tsx, FlagControl.tsx
│   │   ├── review/formats/  MultipleChoiceOptions.tsx, MultiSelectOptions.tsx,
│   │   │                    TrueFalseOptions.tsx, OptionButton.tsx
│   │   ├── feedback/    FeedbackPanel.tsx, XpBar.tsx, XpBarStack.tsx, LevelUpCallout.tsx, CloutChange.tsx
│   │   ├── end/         SpoilsList.tsx, SessionTotals.tsx, SessionMap.tsx
│   │   ├── welcome/     WelcomeBack.tsx
│   │   └── author/      AtomEditor.tsx, QuestionEditor.tsx, OptionListEditor.tsx,
│   │                    LinkedAtomsEditor.tsx, PublishBar.tsx, FlaggedList.tsx, SaveStatus.tsx
│   ├── game/            # plain functions: no database, no React, no clock
│   │   ├── settings.ts, scoreAnswer.ts, nextInterval.ts, levels.ts,
│   │   └── clout.ts, pickQuestion.ts, learnerDate.ts
│   ├── content/         # rules shared by the author page and the content script
│   │   ├── questionShape.ts, questionSetShape.ts, lintQuestion.ts,
│   │   └── insertAtoms.ts, insertQuestions.ts, updateQuestion.ts, publishLecture.ts
│   ├── server/
│   │   ├── auth.ts, access.ts
│   │   ├── db/client.ts
│   │   ├── db/schema/   auth.ts, course.ts, content.ts, progress.ts, reviewEvent.ts, index.ts
│   │   ├── queries/     one file per query listed under Queries
│   │   └── actions/     loadCard.ts, submitAnswer.ts, flagQuestion.ts, startLecture.ts,
│   │                    setSoundOn.ts, noteVisit.ts, markDoorUnveiled.ts, dismissWelcome.ts,
│   │                    author/ (the eight admin actions)
│   └── lib/             authClient.ts, sound.ts, useCountUp.ts, useReducedMotion.ts
├── tests/game/, tests/content/
├── .env.example
├── package.json, tsconfig.json, next.config.ts, vitest.config.ts
└── README.md
```

## Key Technical Decisions

**1. The database is the source of truth; the skill writes to it through a script.** Joe's call: "we should make our own cms then. light," with the skill writing directly. Why: the PRD's in-app editing, flags and draft status all need a database, and a second copy in files would drift. Accepted cost: edited content is not in git unless `export` is run.

**2. A command-line script, not an admin web endpoint.** Joe chose the script. Why: one author, no public surface to secure, and the script shares its rules with the author page. Accepted cost: authoring needs the production database address on Joe's laptop.

**3. A hand-written interval rule, not FSRS.** Why: Joe asked in /prd for the relationship between XP and due dates to be simple and clear, and this rule fits in one small table with one stored number per atom. Accepted cost: it is cruder than FSRS and has no per-atom difficulty. Because every answer is logged, a later switch can replay history.

**4. Next.js with server actions, not Vite + React with a separate server.** Why: sign-in and saved progress need server code, and one project deploys to Vercel as it is. Accepted cost: server actions and the server/browser component split are new to Joe.

**5. Google sign-in through self-hosted Better Auth; Bluesky deferred.** Why: Bluesky's sign-in is not standard OIDC and has only community plugins for Better Auth; Joe said it is "not that important." Accepted cost: none for Stage 1; `better-auth-bsky` can be tried later as a second button.

**6. Styling entirely through theme tokens, with a playground page.** Joe's requirement: palettes must be easy to play with once the skeleton exists. Accepted cost: a little discipline up front (no raw colours in components).

## Dependencies & External Services

| Service | Used for | Cost and limits | Keys |
|---|---|---|---|
| Vercel (Hobby) | Hosting | Free. Personal, non-commercial use only; the account can be paused if limits are passed. https://vercel.com/docs/plans/hobby | Vercel account |
| Neon | Postgres | Free tier is ample for Stage 1; the database pauses when idle and takes a moment to wake. https://neon.com/pricing | `DATABASE_URL` |
| Google Cloud OAuth | Sign-in | Free. https://www.better-auth.com/docs/authentication/google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Google Fonts via `next/font` | Typefaces | Free; fonts are downloaded at build and served from the app. https://nextjs.org/docs/app/getting-started/fonts | none |
| Kenney audio | Sounds | CC0. https://kenney.nl/assets/category/Audio | none |
| Wikimedia Commons | Images | Per-file licences; credit each. | none |

No AI service is called by the app. Question generation happens in Claude Code.

Further reading for /build: server actions https://nextjs.org/docs/app/getting-started/updating-data · Better Auth session on the server https://www.better-auth.com/docs/concepts/session-management · Drizzle with Neon https://orm.drizzle.team/docs/get-started/neon-new · Tailwind with Next.js https://tailwindcss.com/docs/installation/framework-guides/nextjs

## What Stage 1 Leaves Room For

Joe expects to return to the later list soon. These choices keep it open:

- **Other users:** access is one function (`requireLearner`); the email list can become a table without touching pages. All progress is already per user.
- **Intake:** `AtomList.tsx` is the single piece the Stage 2 intake replaces.
- **Loot and glossary:** a new `item` table beside `atom`; the end screen's `SpoilsList` already lists typed rows.
- **Graph view:** `question_link` plus main atoms is the edge list; `SessionMap` is the first drawing of it.
- **Linked credit moving due dates, FSRS, retuned numbers:** all can be replayed from `review_event`.
- **Clout shop, trial contents:** `learner_state.clout` and `lecture_progress.door_opened_at` are the hooks.

## Open Issues

**For Joe to weigh in on**

1. **Level 3 moved from 45 XP to 40 XP** after the conversation, so that a confident learner (who sees each atom less often) still opens the trial door within two weeks. Level 4 and 5 moved to 70 and 110 to keep the spacing. One line in `settings.ts` if Joe prefers the original.
2. **The content script writes to production from Joe's laptop.** It is the simplest route and drafts are invisible to learners, but it means the production database address sits in a local file.
3. **Adding an image needs a commit and a deploy**, because image files live in the repo. Storing them in a hosted file store would let the author page upload directly, at the cost of one more service.
4. **Vercel's free plan is for non-commercial use.** A paid salon, or anything sold, needs the Pro plan.

**Unresolved from the PRD**

5. **The name.** Still "Flashbang." The domain `flashbang.school` expired on 2026-09-14 and is in its redemption period at Namecheap. It can still be restored through Namecheap Support for about $118.68; the window is estimated to close around 2026-11-25, after which it is released to the public around 2026-12-01. Joe has not decided whether to restore it.
6. **The look beyond the starting theme.** Deliberately deferred to after the skeleton.
7. **Both authoring skills are first drafts.** Joe will design the lecture conversation and the question generator iteratively.
8. **Google's consent screen** may need to stay in "Testing" mode with Joe as the test user until other people are let in; check what Google requires at setup.

**Risks noticed in self-review**

9. **No per-atom difficulty.** An atom Joe keeps missing simply cycles at short intervals. Acceptable for seven atoms; revisit with more.
10. **Flag undo assumes the flagged answer is the atom's most recent event.** True in the normal flow (the flag is on the feedback panel). If a second tab answered in between, the snapshot restore could be slightly off; XP and clout are still correct because they are reversed by amount.
11. **Transactions depend on the Neon driver's `Pool` working on Vercel's Node runtime.** If it does not, switch `db/client.ts` to the `pg` driver with Neon's pooled address; nothing else changes.
12. **Unverified version details.** Package versions were read from npm on 2026-11-16. The Next.js 16 behaviours listed under `Stack` and the Better Auth calls shown are from documentation and recent guides, not from running code; confirm against the linked docs at the first build step.
