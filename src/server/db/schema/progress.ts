import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { settings } from "../../../game/settings";
import { atom, lecture, question } from "./content";

// Every `user_id` here is plain text for now: the Better Auth `user` table arrives in
// checklist item 3 (schema/auth.ts), which adds the foreign-key references to user.id.

// Calendar dates ("2026-11-16") are learner dates: see src/game/learnerDate.ts.
// String mode keeps them as plain text in code, so no time zone can shift them.
const calendarDate = (columnName: string) => date(columnName, { mode: "string" });

// One row per learner per atom, created by startLecture.
export const atomProgress = pgTable(
  "atom_progress",
  {
    userId: text("user_id").notNull(),
    atomId: text("atom_id")
      .notNull()
      .references(() => atom.id),
    xp: integer("xp").notNull().default(0),
    intervalDays: doublePrecision("interval_days").notNull().default(settings.intervals.minimumDays),
    dueOn: calendarDate("due_on").notNull(),
    // Counts first attempts only, not retries.
    reviewCount: integer("review_count").notNull().default(0),
    lastReviewedOn: calendarDate("last_reviewed_on"),
    retryPending: boolean("retry_pending").notNull().default(false),
    lastQuestionId: text("last_question_id").references(() => question.id),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.atomId] }),
    // The session queue asks "what is due for this learner today?"
    index("atom_progress_user_due_index").on(table.userId, table.dueOn),
  ],
);

// One row per learner, created on their first signed-in visit.
export const learnerState = pgTable("learner_state", {
  userId: text("user_id").primaryKey(),
  clout: integer("clout").notNull().default(settings.clout.startingBalance),
  soundOn: boolean("sound_on").notNull().default(true),
  timeZone: text("time_zone"),
  lastReviewOn: calendarDate("last_review_on"),
  easedReturnOn: calendarDate("eased_return_on"),
  welcomeDismissedOn: calendarDate("welcome_dismissed_on"),
});

export const lectureProgress = pgTable(
  "lecture_progress",
  {
    userId: text("user_id").notNull(),
    lectureId: text("lecture_id")
      .notNull()
      .references(() => lecture.id),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    doorOpenedAt: timestamp("door_opened_at", { withTimezone: true }),
    doorUnveiledAt: timestamp("door_unveiled_at", { withTimezone: true }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lectureId] })],
);
