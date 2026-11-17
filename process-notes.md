# Process Notes

## /onboard (skipped)
- Joe invoked /scope directly on 2026-11-15 after a long planning conversation. The learner profile was drafted from existing context rather than the interview; inferred lines are marked in the file.
- Context: three earlier builds (SpeedLearner quiz in May, Anki flow in July, conversational workshop + FSRS review mockup in Aug/Sep) all stalled at Lecture 1. Flashbang (June) is the closest prior art for per-atom variants.
- Joe wants to redesign from scratch, keep the Athenian Democracy course, write planning docs here, then build fresh in a new chat (possibly a new repo).

## /scope
- Carried in from conversation before /scope:
  - Core idea: atoms co-decided after each lecture; each atom has many variants across interaction types; spaced repetition graded per atom.
  - Free-text answers skipped for now (hard to grade without self-report or an AI judge); auto-gradable types only; "maybe we should just experiment."
  - Daily loop in Joe's words: "reviewing the things i've learned, making sure they're connecting to the rest of the info, just kinda chewing it over again."
  - Later ideas he raised: glossary with a page per term and Roam-like links between atoms/terms/lectures; collapsible outline per lecture; salon recordings attached to lectures; InterIntellect series; visual novel endgame.
  - Pushback given: reviewer first, everything else parked. Joe agreed ("maybe just one thing at a time").

### Brain dump (2026-11-15)
Joe described two distinct sessions, unprompted, and asked to keep a "later" list open.

**Session A: post-lecture review (weekly, possibly 2x/week).** Needs a stable, reliable, uncrammed slot; he asked for help picking a time. After listening or watching (he'd like the course video too, unsure he can get it):
- step by step review of the facts; clear up anything not understood
- Claude has the transcript and everything so far, and is encouraged to look up supporting material on the web
- unhurried; he wants to be sure he understands the whole lecture and relates it to earlier ones
- co-create the atoms, then he trusts Claude to generate the interactions and does NOT want to see them beforehand (reverses the old rehearsal gate)
- "not too long," but relaxed and enjoyable

**Session B: morning SRS.**
- authenticated, because he wants to offer it to others
- possible "intake" right after a lecture: a ~3 min generated video or a Brilliant-style scrollytell, then the atoms enter the deck. "We can figure out something simple."
- opens like Anki: heat maps, friendly "begin review," today's date in big letters, at-a-glance progress across the whole course
- interactions one at a time like cards; many formats, some with media: interactive diagram + multiple choice, multi-select, fill-in, matching, true/false, typed answer, image hotspot. Good feedback on every choice.
- end of session: see how what he reviewed links to everything else
- dashboard: mastery across all atoms and all courses, maybe a big knowledge graph
- later: bespoke layers (visual novel simulation to score ideas, zettelkasten-style linking of atoms into new ideas)
- salon participants need a low-demand mode: review once a week alongside the new lecture, no daily habit required

**Repo question.** Joe asked whether to move repos or delete anything. Advice given: delete nothing; build the app in a new repo since it is meant for multiple courses and other users; this repo stays the Athenian Democracy source library; planning docs written here move over when the new repo exists.

### Research shared
Math Academy (knowledge graph, credit flowing between linked topics), Execute Program (short lessons, few review levels, machine-graded, low frequency), Quantum Country / Orbit (prompts embedded in prose; Matuschak's later finding that readers need more control).

### Reaction to research
- Joe supports the repo plan (new repo for the app; this one stays the source library).
- Already familiar with all three references. Math Academy is the one he loves: "if there's some way to make something similar to math academy out of what we have, that's the gazillion dollar idea." Wants it noted and explored for what is possible in the prototype.
- Reminder from Joe, unprompted: it must be palatable to people who might enrol in his InterIntellect salon.
- Claude's note on translating Math Academy to history: links between atoms are not strict prerequisites; the cheap version is a variant tagged with several atoms, so answering it gives credit to each.

### Salon participant (Joe's words, condensed)
- InterIntellect attendees: knowledge/tech workers, "smart brainy nerdy introverted," earnest, looking for friendship.
- Keep their time limited: maybe 5-10 minutes in the app at the start of each weekly salon. Could optionally review at other times.
- Marketing angle: "test out my edtech experiments as we learn the course."
- Must be able to join at a later lecture without attending the first few; catching up should be easy.
- He sees a tension between their weekly cadence and his own daily review; wants both supported.
- First salon probably January 2027, not fixed. Wants to share the app publicly and write about it before then.
- Claude's notes: (1) a "what's due now" scheduler serves both cadences without a separate mode; (2) public sharing raises a copyright line: atoms and questions in our own words are fine, transcripts/audio/long quotes from the Great Courses are not.

### Cut line (beat 4)
- Claude proposed four rows: first build / before writing about it / before the salon / later. Joe accepted as proposed ("all sounds good! i like this").
- Correction from Joe: the prototype is NOT due tonight; good progress today is enough. Claude had over-weighted an earlier "by end of day tmrw" remark.
- Confirmed: salon participants are expected to buy the course themselves.
- New requirement from Joe: review must feel "really dopaminergic" when you get answers right, and you should see the atom gain "xp" right there in the review UI.
- Active shaping so far: Joe drove the two-session framing, the hidden-interactions rule, the salon constraints, the Math Academy north star, and the XP/dopamine requirement. He accepted Claude's repo plan, format shortlist, and staging without changes.

### Deepening round 1: feel
**Q1, what to steal from.** Joe: 90s JRPG design. XP bar climbing toward the next level, maybe loot drops. Knowledge items (glossary terms, events, people, atoms) are loot added to a collection. Levels and XP. And the Math Academy idea made visible: as you answer, you can see the credit propagate through the graph to linked atoms.
- He pointed to old Flashbang (2023-24, https://seph.news/projects/flashbang). From the project page and one demo transcript: bite-sized interactive videos split into atoms; each atom's level measured by performance on its flashcards; network graph of atoms; morning inbox; typed answers graded by GPT-4; later RPG elements (pick a class, heads-up display, a superintelligence-from-the-future narrative); loot collected while watching a video. Only one of three demo transcripts could be fetched (YouTube blocked the other two).
- Claude's synthesis: the glossary Joe asked for earlier is the JRPG collection screen (bestiary / item menu), so "glossary pages" and "loot" are one feature, not two.

**Q2, fiction.** Joe: JRPG mechanics on their own, no story *for now*; fiction is a big feature to build up later. Confirmed: each atom has a level and so does the player; XP flows through the knowledge graph Math Academy style.

**Flashbang Dev Log 0** (https://www.youtube.com/watch?v=0Qcefobh1MU; Joe pasted the transcript, Claude viewed six frames in the browser). The reference Joe most wanted pulled in:
- A module ("Warsaw Pact Resistance") has three tabs: **Video / Review / Cards**.
- *Video:* the video pauses for easy comprehension pop-ups (meant to check attention, not to be hard). A right answer shows a green panel with a one-sentence explanation and Continue. Each right answer drops an item into a **"Your Loot"** sidebar.
- Loot is typed, with an icon per type: quotes, atoms (the module's main points, richer than the rest), people, ideas. By the end the sidebar held ten items (De Tocqueville on Revolutions, East German Workers Uprising, Nikita Khrushchev, Destalinization, Fraternal Assistance, Hungarian Revolution, Brezhnev Doctrine, Prague Spring, Leonid Brezhnev, Normalization).
- *Review:* you take each loot item in turn and a network graph assembles node by node, with a percentage bar; at 100% the Cards phase unlocks. Purpose in Joe's words: you covered the items in isolation, now "knit them together" into a whole view of the module.
- *Cards:* each loot item is a card with its text and an "Assign to Deck" button. Loot is called back in later modules and eventually forms one big graph of the course.
- Look: dark, minimal, white sans type, blue accent button.
- Claude's mapping to the new design: Flashbang's Video stage is replaced by Garland's lecture plus the conversation with Claude; the Review and Cards stages are the "intake" Joe was asking about (new loot drops, graph assembles and attaches to earlier lectures, items enter the deck).

**Loot detail.** Joe shared a still of the Flashbang loot sidebar. Claude noted that the atom icon was used for events there (East German Workers Uprising, Hungarian Revolution, Prague Spring), and proposed keeping atoms as main ideas and making events their own loot type alongside people, quotes and terms. Joe: "yeah."

**Two audiences (Joe's reminder).** There are two things being designed: (1) content-creation skills for admins like Joe, i.e. the post-lecture conversation and the generation of atoms, loot and interactions; (2) the user experience, which is purely for people taking the course and experimenting. Learners never see the authoring side.

**Q3, the look.** Joe: "90s utopian scholastic styling w a few jrpg flavors/skeumorphic vibes." Claude's reading: the optimistic educational-multimedia look of the era (Encarta, Eyewitness books, Scholastic, Magic School Bus, which he named in his Flying University notes) as the base, with JRPG touches such as XP bars, menu windows and item-get moments layered on sparingly. Not dark-minimal Flashbang, not the pottery kit as-is.

**Q4, what would make him proud.** Joe: "a really satisfying, almost duolingo-like game vibe that's addictive, but that feels like gazing onto a math academy for humanities, a vista of knowledge." He can imagine someone saying "i wish this was like what college was." New reference: 2 Hour Learning / Alpha School, specifically the two-hour computer-based part of the day; he wants that feeling "at the college/independent scholar level."
- Claude's reading: two "watch this" moments. (1) The answer moment: fast, juicy, rewarding. (2) The vista: seeing the whole body of knowledge and your mastery spreading across it.

Deepening round 1 complete (4 questions, all on feel). It materially changed the scope: loot and glossary merged into one collection feature, the intake got a concrete shape from Flashbang Dev Log 0, the look was defined, fiction was explicitly deferred, and the admin/learner split was made explicit.

### Scope doc generated
- `docs/scope.md` written 2026-11-15 after one deepening round. Joe chose to proceed ("write it").
- Working title "Flashbang: Athenian Democracy" chosen by Claude as a placeholder; flagged as an open question.
- Open items carried into /prd: name, XP vs scheduler, whether linked credit affects due dates, Stage 1 progress storage, hosting/sign-in, weekly calendar slot for Session A (owed by Claude), course video availability.
- Not done: this repo's uncommitted September work is still uncommitted; Joe has not asked for a commit.

## /prd
- Started 2026-11-15. Stage 1 is the PRD target (Joe only, Lecture 1, four formats).

### Q1, home screen
- Joe: wants to know he is logged in; "i want auth." Username + avatar top right of navbar.
- Three levels: courses list (only one for now) > course view with progress across all lectures > review.
- Inbox in the navbar near the username, with notifications: the inbox size / reviews due. Nothing due = no bell badge, no red number.
- Conflict with scope: sign-in was cut from Stage 1 and placed in Stage 2. Claude raised it as a scope-guard question.
- Joe chose real sign-in for Stage 1 "if possible"; suggested Bluesky OAuth, guessing light effort. Claude: doable, but Bluesky OAuth is fiddlier than Google/GitHub, and the real cost is that hosting + server-stored progress move from Stage 2 into Stage 1. Provider choice deferred to /spec with Bluesky as Joe's preference. Scope change: sign-in moves into Stage 1.
- Providers: Bluesky plus maybe one other (Google). Stage 1 access: Joe only; anyone else is turned away.

### Q2, course view
- Joe: unstudied lectures are greyed out, with "some sense that there are cool things there waiting for us." Each studied lecture shows an aggregate view of its gained atoms and their XP levels.
- Claude's draft reading: greyed lectures keep number + title visible, with unrevealed loot shown as silhouettes/question marks; not clickable.

### Q3, the card and a right answer
- Joe: card shows the question ("i'd LOVE images as often as possible") and answers in different interactive types; UI feels "gamey and fun."
- Confidence slider (a real UI slider, like the current mockup) set BEFORE answering; it modifies payoff/penalty.
- A running score is visible through the session.
- Right or wrong, an answer message explains it. Right: a nice noise, things turn green, an explainer corroborates or expands, and the associated atom's XP bar climbs on a progress bar "similar to final fantasy 7."
- Claude's notes: images are new vs scope (Stage 1 listed none); draft rule = image when a real, credited one exists, card must work without. Sound is new too.

### Q4, a wrong answer
- Joe: images from Wikimedia and from the Great Courses materials themselves, always attributed. Unsure about XP drop ("whatever makes the game make sense"); thinks you should always be able to earn XP by doubling back and getting it right; asked for Claude's thoughts. Firm: the card comes back later, "we drill till we get it right."
- Claude proposed: atom XP never drops and levels never fall; a miss costs session score (scaled by confidence) and makes the atom due sooner; missed card returns later in the session; a retry earns a small fixed XP; only the first attempt counts for scheduling. XP is its own number, separate from the hidden memory schedule (answers a scope open question).
- Claude flagged: Great Courses images conflict with the scope's copyright line once the app is public; fine while Joe-only.
- Joe accepted the logic and pushed it further: make confidence "the gamiest bit," with an ancillary in-world counter (money / "cloutpoints," otherwise meaningless) that responds to it; confidently wrong loses it all. Joe's idea, unprompted.
- Images: Joe accepted the copyright flag: Wikimedia or public domain only. Added: sometimes images are generated automatically, "that'd be fine" (reverses the old repo's no-AI-images rule; Claude will require them to be labelled as generated).
- Retry card (same question vs new variant): Joe did not answer; Claude defaulted to the same question returning.
- Correction from Joe (overrides Claude's default): after a miss, a DIFFERENT question on the same atom comes back, not the same one.

### Q5, clout and confidence
- Joe asked what would feel most JRPG and be cheap, and what else confidence could do. Claude proposed: clout = persistent gil-like number in the navbar, nothing to spend it on yet; four-notch stake slider (Guess / Hunch / Sure / All in; All in doubles or zeroes clout); confidence also feeds scheduling and a small XP bonus; limit gauge and calibration stat deferred.
- Joe: "ahh cool. let em buy stuff later. yes this fine for first pass." Shop goes on the Later list.

### Q6, linked atoms
- Joe: "a stack of xp bars when it happens." Did not address the credit split.
- Claude's defaults (stated to Joe): main atom's bar on top with full XP, linked atoms' bars stacked beneath with a smaller share; in Stage 1 linked credit is XP only and does not move the linked atoms' due dates.

### Q7, credit split, XP vs due dates, unlocks, end screen
- Joe asked for a subagent to research how Math Academy (Justin Skycak) splits credit before settling the split; fine with a super-simplified version but wants to know the bones first. Research launched 2026-11-16.
- Joe asked whether XP and due dates can be linked "in a mathematically clean way," or whether XP can unlock things. Idea from old Flashbang notes: final exams are visual novels / adventure games, unlocked by XP. Inspiration: Star Fox 64, Diddy Kong Racing level unlocking. Wants it kept proof-of-concept sized, with ideas noted.
- End screen (Joe): should feel like a JRPG after-battle screen, "the sense of collecting loot and xp," but not on the nose; do not superficially replicate battle.
- Claude's ideas offered: (1) two layers per atom: permanent level from XP, plus a fading "shine" that is the scheduler's memory estimate; (2) one credit number per review drives both XP and schedule, with more XP for reviews done when due than when early; (3) Diddy Kong-style gate: a locked "trial" per lecture with a visible level requirement, the trial itself deferred.
- Math Academy research returned (sources: justinmath.com FIRe post, The Math Academy Way ch. 26-27, mathacademy.com how-our-ai-works / how-it-works). Bones: per topic a repetition count and a memory value that halves every interval; a pass sends credit DOWN to simpler "encompassed" topics by expert-set edge weights, multi-hop; a fail sends penalty UP to more advanced topics; early reviews are discounted; per-student-topic speed multiplies credit; tasks are picked to cover the most due reviews. XP is separate (1 XP = 1 minute of focused work), not tied to due dates; mastery, not XP, unlocks topics. Not published: the interval schedule, discount function, how weights combine across paths.
- Claude's simplified proposal: weights live on the question (main atom 1.0, each linked atom a weight Claude sets at generation, default about a third), one hop only; a miss affects only the main atom; early reviews pay less. Awaiting Joe's reaction and his answer on the trial door.

### Q8, simplification
- Joe: locked trial door is in Stage 1 as a TBD placeholder that opens to nothing; gate it on atom levels. Rejected the "shine" layer ("too cute"). Asked for the simplest ontology with accurate names, no analogies. Likes the simplified Math Academy credit because it generalises to humanities subjects. Said the XP / due date relationship needs more simplification and clarity, and asked for a web diagram of the current system.
- Claude's simplification: XP and the schedule are separate numbers updated from the same answer; the only link is that an atom is shown only when due, so full XP is earned once per interval. Dropped: shine, the single shared credit number, the early-review discount (nothing is reviewed early in Stage 1).
- Plain names: XP, Level, Interval, Due date (atom); Clout, Learner level (learner); Main atom, Linked atoms with weights (question).
- Diagram published as an artifact, "Review Scoring Model"; source in the session scratchpad, to be folded into docs/prd.md.

### Q9, bad questions
- Joe approved the scoring model and the diagram ("this seems alright. the artifact is good").
- On bad questions Joe swung toward an author interface: "i'd ideally absolutely want to review each question and atom at creation time. that's part of my work! could just be an artifact with text fields i can edit."
- This reverses the scope's hidden-questions rule (Session A step 5) and its cut of the rehearsal gate, which the scope blamed in part for earlier stalls. Claude named the contradiction and asked Joe to choose; recommended an author page that is always available but never required before questions go live, plus a flag control during review.
- Joe's decision: reverse the hidden-questions rule "certainly." He reviews questions at creation on an author page with editable fields; fine to lose meeting them fresh. Scope change: Session A step 5 is now "Claude generates, Joe reads and edits on the author page, then publishes."
- Claude's reading (stated to Joe for correction): questions are drafts until Joe publishes the lecture with one action for the whole lecture, not a per-question pass/revise/cut ritual; the flag control during review stays as the safety net.

### Q10, formats and editing
- Joe: the question generator will take "lots of prompting and examples"; expects to be hands-on with it for quite a while. Editing happens twice: at creation, and at any time from an edit screen inside the app, admin account only (his).
- Multi-select: Joe leans fully wrong unless fully right; Claude agreed (all or nothing, with feedback showing which options were right, missed, or wrongly picked).
- Fill-in dropped by Joe for now. Stage 1 formats are now three: multiple choice, multi-select, true/false.
- Claude's defaults for edits: editing an atom's or question's wording keeps all progress; deleting a question never removes earned XP.
- Mandatory questions complete; deepening choice offered.

### Deepening round 1 (Joe chose another round)
- D1 session shape. Joe: progress must save per card, so scheduling changes per card review, not per stack. Asked how Anki/FSRS handle overlong stacks; thinks overload is unlikely on a weekly lecture cadence.
- Claude: Anki uses daily caps on reviews and new cards; FSRS lowers load via a target-retention setting. Not needed here: scheduling is per atom, so the ceiling is the atom count (7 now, roughly 150 for the full course). Recommended no cap in Stage 1: a session is every due atom once plus retries, most overdue first, count shown up front; splitting into rounds noted for when a day exceeds about 20. Leaving mid-session keeps everything answered; pending retries wait.
- D2 level-up. Joe: no cap confirmed. A level-up gives the atom a different look and plays "a cool noise"; that is enough for now. Later note (Joe's idea): progressively disclose more information, nuance and interrelations about an atom as it levels up.
- D3 generation quality. Joe (dictated): variety has two goals, engagement and learning the atom from different positions so you don't memorise the pattern of one prompt, "a common failure mode for using spaced repetition on knowledge subjects." Wants an even mix of formats for now, with complete control when authoring to swap anything, "because we're going to need to iterate a while."
- Joe's two hard rules for generated multiple choice, to be written down and kept: (1) the correct answer must not be noticeably longer than the wrong ones; (2) wrong answers must not use absolute language while the correct one is nuanced or qualified.
- Joe asked Claude for the ideal number per atom. Claude recommended 6 (2 per format, 42 for Lecture 1): enough to cover roughly the first two months of reviews plus retries without a repeat, small enough to read in one sitting; top up an atom later when it runs low. Claude proposed further checks, labelled as its own.
- Joe did not strike any of Claude's added checks (no explicit acceptance either; carried into the PRD as proposed).
- D4 device. Joe: laptop. Design responsively, but otherwise do not worry about mobile.
- D5 the 20-second clip. Joe: questions in each interaction format with the XP bar; the end-of-review screen showing XP collected and a level-up, "all the various fun things," including loot as in the old Flashbang example; and maybe a quick shot of the knowledge graph showing how atoms and interactions relate across all lectures.
- Scope guard raised by Claude: typed loot is Stage 2 and the cross-lecture graph is Stage 3 in the scope; with one lecture there is nothing cross-lecture to draw. Offered a Stage 1 stand-in: the end screen draws the atoms touched and the links between them.
- Joe accepted the small end-screen map for Stage 1, with loot and the full graph staying in Stages 2 and 3, but: "assume we're gonna double back and attack this later list soon. keep that in mind." The PRD should keep the later items concrete and avoid Stage 1 choices that block them.
- Deepening round 1 complete (5 questions: session shape, level-up, generation quality, device, the 20-second clip). It added per-card saving, no session cap, level looks and sound, six questions per atom with named quality rules, laptop-first, and the end-screen link map.

### Deepening round 2 (Joe chose another round)
- R2-1 first session. Joe (dictated): ideally a pre-intake step before any review. The app assumes you have listened to the lecture, and other users should be coached that this is a constraint: finish the lecture, then come here. Ideally also a quick review of the main points "in some totally different medium" in the app before spaced repetition starts, though that "may be too much for now" and may belong on the later list.
- Claude's Stage 1 default: a listen check ("Have you finished Lecture 1?") followed by one plain screen listing the lecture's atoms to read once, then the atoms enter the inbox. The richer different-medium intake stays in Stage 2, where the scope already has it.
- Joe follow-up: wants space left for the richer intake later without the first dive feeling abrupt. "Ideally, the spaced repetition interactions themselves would teach the concept and not just test your existing knowledge of it, assuming you watched the lecture."
- Claude's answer: (1) a fixed "start lecture" step in the flow that holds the listen check and atom list now and the intake later; (2) one of each atom's six questions is marked introductory and is always the first one shown, on a card labelled New; (3) every explanation states the atom's idea in full and adds context, so feedback teaches whether you were right or wrong.
- Joe accepted all three (start-lecture step, introductory question per atom, explanations that teach).
- R2-2 other people. Joe: a plain "not open yet" is fine; no waitlist or contact capture.
- R2-3 sound. Joe: a gentle wrong-answer sound, yes. Sound off in a predictable, conventional place; left to Claude. Claude's choice: a speaker toggle in the navbar, remembered for the account; no separate clout-loss sound except the All in wipe; animations shortened when the system asks for reduced motion.
- R2-4 trial door. Joe: reachable after about a week or two of daily review, give or take. Meeting it should feel like a reward with a "cool unveiling," then the screen just says coming soon.
- R2-5 returning after a gap. Joe: "definitely only show a subset of what's due as a total," plus an intentional feature for easing people back in. Reference: MacroFactor, which on his return after a long absence showed a small popup that welcomed and reoriented him; "it made it just a little bit easier."
- Claude's draft: after 7 or more days away, a welcome-back message that says where he is in the course and offers a short session (about 5 atoms, most overdue first); the inbox badge shows that short session's count, not the backlog; after it, an optional "keep going"; no overdue wording, no streaks, nothing lost. This is the one exception to "no session cap."
- Deepening round 2 complete (5 questions: first session, other people, sound, trial door, returning). It added the start-lecture step, introductory questions, teaching explanations, the mute toggle, the door's timing and unveiling, and the welcome-back flow.

### PRD generated
- `docs/prd.md` written 2026-11-16 after two deepening rounds (10 questions) on top of ten mandatory-phase exchanges. Joe chose to proceed ("nah write it now"). Diagram source copied to `docs/review-scoring-model.html`.
- **Added or changed vs the scope:** real sign-in and hosted progress pulled into Stage 1; the hidden-questions rule reversed in favour of reading and editing at creation plus an in-app author page; fill-in dropped (three formats); images and sound added; confidence slider, clout and the trial door invented; XP separated from the schedule; linked credit fixed as XP only; start-lecture step, introductory questions, welcome-back flow and flagging defined.
- **"What if" moments that landed:** the bad-question edge case, which led Joe to rethink authoring entirely; returning after ten days, which produced the welcome-back flow from his MacroFactor experience; the first-ever session, which produced "questions should teach, not only test."
- **Pushback and strong feelings:** Joe rejected the "shine" layer as "too cute" and asked for accurate names instead of analogies; insisted the XP / due date relationship be simpler; insisted on two generator rules (answer length, absolute language); wanted sign-in despite the scope cutting it.
- **Scope guard:** kept out of Stage 1 with Joe's agreement: typed loot, the cross-lecture graph (stand-in: end-screen map), the richer intake (stand-in: listen check and atom list), the clout shop, what is behind the trial door. Pulled in against the scope: sign-in, hosting, author page, images, sound. Stage 1 is now well beyond a 3-4 hour build; the PRD gives a cut order. Joe: assume the later list gets attacked soon.
- **Active shaping:** Joe drove most requirements: three-level navigation, inbox badge, confidence as a UI slider, clout as a losable currency, drill-until-right with a different question, the trial door gated on atom levels, the author page, the generator rules, the end screen's feel, the welcome-back idea. He asked for Claude's recommendation on game logic, multi-select grading, questions per atom, and session caps, and accepted each. He commissioned the Math Academy research before deciding the credit split.
- Defaults Claude chose without explicit confirmation are marked *(default)* in the PRD.

## /spec
- Started 2026-11-16. All of docs/ and process-notes read first. Open questions carried in from the PRD: name, sign-in providers, hosting and storage, the numbers, interval logic, where content lives, admin detection, the look.

### Q1, stack preferences
- Joe: backend/database knowledge is rusty and may be out of date. Has used Postgres; Neon was his go-to. Open to anything "simplest and cleanest." Wants to discuss auth: asked for options with descriptions so he can weigh in.
- Research (2026-11-16): Bluesky sign-in is its own OAuth profile, not OIDC, so managed auth services (Neon Auth, Supabase Auth, Clerk) do not offer it out of the box. Neon Auth is now managed Better Auth (free to 60k MAU). Two community Better Auth plugins for Bluesky exist (better-auth-bsky v0.1.9, better-auth-atproto v0.1.0); neither official; maintenance not verified.
- Claude offered four options and recommended self-hosted Better Auth on Neon, Google first, Bluesky second via plugin.
- Joe chose option B: self-hosted Better Auth on Neon, Google sign-in first. "bsky sign in not that important"; Bluesky becomes a later, optional second button. Settles the PRD open question on providers.

### Q2, deployment
- Joe: Vercel ("liked fine"). Free vercel.app address for Stage 1; custom domain eventually.

### Q3, research and overall shape
- Research shared: Next.js 16 (App Router), Better Auth, Neon via Vercel marketplace, Drizzle 0.45 (1.0 still RC), ts-fsrs 5.x (FSRS v6), Vercel Hobby (non-commercial only; a paid salon would need Pro).
- Claude proposed Next.js over Vite + React because sign-in and saved progress need server code; one project, server actions instead of API endpoints. Joe: "next.js is fine! i like it."

### Q4a, where content lives
- Claude proposed database as the source of truth with a one-way file import. Joe agreed on database-as-truth and pushed further (his idea): "we should make our own cms then. light. admin view," and the skill should write to it directly through the API or the database, with no file in between.
- Claude accepted: the intermediate content file is dropped. The skill calls a small command-line script that validates and inserts drafts using the same functions as the author page.

### Q4b, skill access and tables
- Joe chose the command-line script over an admin API ("the script seems better"). Accepted the table set, including the review_event log, without changes ("tables seem fine too").

### Q4c, intervals and numbers
- Claude proposed a hand-written interval rule instead of FSRS (multiply by 1.5 / 2.2 / 2.8 on a correct first attempt by confidence; halve on a miss, reset to 1 day on a confident miss), on the grounds that Joe asked in /prd for the XP and due-date logic to be simple; the answer log allows a later switch to FSRS by replay.
- Numbers proposed: 10 XP base plus 0/2/4/6 by confidence; retry 3; levels at 20/45/80/125; door at all atoms Level 3 (about day 7 to 14); learner level per 100 XP; clout starts at 100 with +5/0, +10/-5, +25/-25, double/zero.
- Joe accepted all of it as a first pass ("no this seems fine"). Deferred to Claude; no changes.

### Q5, file structure and data flow
- Claude proposed the file tree (app / components / game / server / scripts / skills), access via allowed-email and admin-email settings, transcripts staying in this repo, and the one-answer data flow with server-side grading and a single all-or-nothing write. Joe: "all seems good to me." No changes.
- Name and domain: Joe asked for a background check on whether he owns flashbang.school through Vercel (subagent launched 2026-11-16); suggests the Flashbang name is staying.
- **Note for later (Joe's request):** iteratively design the lecture conversation and the question generator after the app exists; the spec should treat both skills as first drafts to be tuned, not finished designs.
- Joe wants to talk UI design next (his choice of topic).
- Domain check result (2026-11-16): flashbang.school is only listed in Vercel as a third-party domain, no project attached. Registry record: registered 2023-09-14 at Namecheap, expired 2026-09-14, status "redemption period" since 2026-10-26, does not resolve. Joe must restore it at Namecheap if he wants it; not confirmed that the Namecheap account is his.

### Q6, UI design
- Joe on the domain: "i think it's a bust"; asked for a second browser subagent to see what could happen (launched: Namecheap account and restore options, read-only).
- Joe on the look: "90s utopian scholastic mixed with jrpg dynamics. a little brutalism maybe." New requirement (his): once the skeleton of the app is out, palettes and styling must be easy to play with. He did not describe the card in detail; the concrete starting theme is Claude's proposal.
- Claude proposed: all styling values as named variables in one theme file, themes as swappable value sets, a /theme playground page showing every component in every state, Tailwind v4; starting theme = cream paper, flat primaries, thick black outlines and hard shadows, menu-window panels, segmented XP bar, atom levels as materials (paper, bronze, silver, gold, prismatic). Build order: skeleton first in the starting theme, palette play afterwards as its own step. Joe: "good. yes proceed." No changes.
- Mandatory questions complete; deepening choice offered.

### Spec generated
- `docs/spec.md` written 2026-11-16. **Deepening rounds: zero.** Joe declined ("go for it now. no more rounds"). The topics a round would have covered (local development, error handling, images and sounds, what "today" means, self-review) were filled with Claude's defaults and marked *(default)* in the spec.
- **Stack and why:** Next.js 16 with server actions (one project, no separate server), Better Auth self-hosted with Google (least auth code that still leaves room for Bluesky), Neon Postgres (Joe's old go-to), Drizzle 0.45, Tailwind v4 (theme as CSS variables), Vercel Hobby. Versions read from npm on the day.
- **Decisions Joe made or drove:** Google over Bluesky; Vercel; database as truth; "our own light cms" with the skill writing directly (his idea, replaced Claude's file-import design); command-line script over an admin API; palettes must be playable after the skeleton; "a little brutalism"; the two skills to be designed iteratively later.
- **Decisions Joe deferred to Claude:** the table set and the answer log, the hand-written interval rule and every number, the file layout and data flow, the token/playground design approach and the starting theme. He accepted each without changes.
- **Confident vs uncertain:** confident about hosting, product direction and the cms idea; openly unsure about backend and auth ("may be out of date"), and asked for options with descriptions before choosing.
- **Caught in self-review after the conversation:** the accepted Level 3 threshold (45 XP) would have broken the PRD's "door opens in one to two weeks" for a learner who always answers at Sure; changed to 40 and flagged as Open Issue 1. Also flagged: production database address on the laptop, images needing a deploy, Vercel Hobby's non-commercial rule.
- **Side quest:** flashbang.school found expired (2026-09-14) and in redemption at Namecheap; a second browser check of restore options was still running when the spec was written.
- Namecheap check result: the domain was in Joe's Namecheap account (expiry notice dated 2026-09-17) and is no longer listed; no restore button. Namecheap's price table gives about $118.68 to restore a .school domain in redemption, done by adding funds and contacting Support. Estimated: restore window closes about 2026-11-25, public release about 2026-12-01 (estimates, not confirmed). Side effect: opening the expiry notice marked it read. Joe has not decided.

## /checklist
- Started 2026-11-16. All of docs/ and process-notes read first. Spec has no deepening rounds behind it and many *(default)* items; Stage 1 is far beyond a 3-4 hour build, so the checklist will need more than the usual 8-12 items or a staged cut.
- **Sequencing:** Joe delegated it entirely ("whatever u think is best") and asked Claude to collect accounts and settings first, then build fully autonomously. He did not question or reshape the order. Claude's order: risky plumbing first (deploy, database transaction on Vercel, sign-in), then rules and content with no screens (game functions, content script, Lecture 1 drafts in dev), then the daily loop (shell, course views, start step, cards, saving, feedback, sound, end screen), then door, flagging, author page, welcome-back, images, theme playground, then production launch.
- **Preferences:** autonomous; no verification checkpoints; commit and push after each item; comprehension checks and check-in cadence not applicable.
- **Size:** 22 items, roughly 10 to 12 hours of agent time. Well over the usual 8 to 12 items because Stage 1 grew in /prd; the checklist header carries a cut order instead of trimming now.
- **Submission:** Joe is not submitting to any hackathon. The Devpost item is replaced by a production launch item (content loaded as drafts, Joe reads and publishes, first real review). Repo is to be public.
- **Deepening rounds:** zero. Joe wanted to move straight to building.
- **Found while preparing:** (1) a private GitHub repo `flashbang` (last pushed 2024-11) and a Vercel project `flashbang` already exist, so the checklist defaults to `flashbang-app` pending Joe; (2) Joe asked Claude to set up the Google OAuth client in the browser; the browser is signed in to a different Google account than the one Joe named, and Google Cloud is asking that account to accept its Terms of Service. Claude stopped there and asked.
- **Needed guidance vs confident:** confident about wanting speed and autonomy; left every build-planning choice to Claude.
- **Setup done during /checklist (2026-11-16):** Joe confirmed `flashbang-app` "for now" for GitHub and Vercel. With Joe's go-ahead Claude set up Google sign-in in the browser under Joe's account: new Cloud project `flashbang` (billing account `homer`, Google's preselected one; OAuth is free), consent screen "Flashbang" in Testing mode with Joe as the only test user, OAuth client "Flashbang web" with the localhost redirect address. Joe accepted the Google API Services User Data Policy through Claude. The production redirect address is still to be added after the first deploy. `~/Developer/flashbang` created with the docs copied in; it is the live copy from here on.

## /build
- Run 2026-11-16 to 2026-11-17, autonomous mode, no checkpoints. One subagent per checklist item, in order, each committing and pushing; the orchestrator ticked boxes. Items 1 to 7 ran on Fable 5.2; from item 8 Joe asked for Opus 5.5 subagents to conserve Fable usage.
- **Items completed:** 21 of 22. Item 22's agent part is done (production migrated and seeded, Lecture 1's 7 atoms and 42 questions loaded as drafts, backup in `docs/content-backups/`, README). Item 22 stays unticked until Joe reads the questions, publishes, and does the first review.
- **Checklist revised?** The items were not changed, but the order was: Neon could not be added from the CLI, so item 4 (scoring rules) and the code-only half of item 2 ran first while the database waited. A "Needs Joe" note recorded the wait and was replaced once resolved.
- **What went wrong:** the item 1 agent ran `vercel link`, which overwrote `.env.local` and lost the two Google values and both email lists; no backup existed. Joe pasted them in again. Every later agent was told never to run `vercel link` or a bare `vercel env pull`, and to back up env files first. Neon needed the web UI: Joe asked Claude to do it through the browser; Claude created the free database (Neon Auth off), connected it to the project, and made the `dev` branch with auto-delete set to Never, moving connection strings by clipboard so they never appeared in the chat.
- **Joe during the build:** asked the format for the email settings (raw string, comma-separated for more), asked for the browser to do the Neon setup, and asked for cheaper subagents after checking his usage. No checkpoints were requested and none were taken.
- **Not verified by a person yet:** nothing from item 7 onward has been seen in a real signed-in browser, and nobody has heard the sounds. Agents verified with unit tests (156), scripts against the dev database using throwaway users, server-rendered HTML and `curl`. The real Google round trip, the look, animations, hover and keyboard behaviour, and the sounds are Joe's to check.
- **Defaults taken worth a look:** graded options stay on the card above the feedback panel; flagging a retry answer brings back a retry card; "Add question" on the author page always makes a draft; an atom cannot be deleted once answers to its questions exist; a return visit without a review shows the welcome message again the next day; disabled buttons got their own tokens after failing contrast at 60% opacity; five Kenney sounds were chosen by filename and length.
- **Still waiting on Joe:** add `https://flashbang-app.vercel.app/api/auth/callback/google` to the Google OAuth client; sign in locally (port 3000 must be free) and on Vercel; read and edit the 42 questions on `/author/1`; press "Publish lecture"; start Lecture 1 and review.
- **Overall:** the plan held. The only real trouble was account plumbing in item 1, which the checklist had put first for that reason.
