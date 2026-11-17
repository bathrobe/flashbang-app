# Flashbang

A daily review game for a lecture course: Robert Garland's *Athenian Democracy*. Each lecture is boiled down to a few one-sentence ideas ("atoms"). Every atom has six questions; answering them earns XP, levels the atom up, and decides when it comes back. Stage 1 covers Lecture 1 and one learner.

Live: https://flashbang-app.vercel.app. The plan lives in `docs/` (`prd.md`, `spec.md`, `checklist.md`).

## Run it locally

1. `pnpm install`
2. Copy `.env.example` to `.env.local` and fill in: `DATABASE_URL` (Neon `dev` branch), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ALLOWED_EMAILS`, `ADMIN_EMAILS`. `.env.production.local` holds only production's `DATABASE_URL`, for the content script. Both files are git-ignored.
3. `pnpm dev`, then open http://localhost:3000.

Port note: if 3000 is taken, run `pnpm dev --port 3001`. Google sign-in only works on a port whose redirect address is registered in the Google OAuth client, and `BETTER_AUTH_URL` must match the port.

## Scripts

| Script | Does |
|---|---|
| `pnpm dev` | Runs the app locally |
| `pnpm build` | Production build |
| `pnpm test` | Runs the tests |
| `pnpm lint` | Lints the code |
| `pnpm db:generate` | Writes a migration from the table definitions |
| `pnpm db:migrate` | Applies migrations to the `dev` branch |
| `pnpm db:migrate:prod` | Applies migrations to production |
| `pnpm db:seed` | Inserts the course and its 24 lecture titles (safe to run twice) |
| `pnpm content <command>` | Content script against `dev` |
| `pnpm content:prod <command>` | Content script against production |

Content commands: `list`, `add-atoms`, `add-questions` (`--append` to top up one atom), `export`. Each takes `--lecture N`; the add commands read JSON on standard input. Run `pnpm content` with no command to see the usage.

## How content gets in

1. Listen to a lecture, then in Claude Code say "let's do lecture N". The `lecture-conversation` skill talks it through and saves the agreed atoms with `add-atoms`.
2. Say "generate questions for lecture N". The `generate-questions` skill writes six draft questions per atom and loads them with `add-questions`. Its rules are in `.claude/skills/generate-questions/rules.md` and `examples.md`; edit those to steer it.
3. Open `/author/N` on the site, read and edit every question, then press "Publish lecture". Nothing is visible to a learner until then, and later edits never change progress.

Back up a lecture with `pnpm --silent content:prod export --lecture N > docs/content-backups/lecture-0N-<date>.json`.

## Tuning

- Numbers (XP, levels, intervals, clout, the welcome-back session, when the day rolls over): `src/game/settings.ts`.
- Look: theme tokens in `src/app/theme.css`, the theme itself in `src/app/themes/starting.css`. `/theme` shows every component in every state. After changing colours, check contrast with `pnpm exec tsx scripts/checkContrast.ts`.

## Credits

- Sounds: `public/sounds/CREDITS.md`
- Question images: `public/question-images/CREDITS.md`
