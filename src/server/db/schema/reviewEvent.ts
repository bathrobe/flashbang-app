import { boolean, date, index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { confidenceSteps } from "../../../game/settings";
import { atom, question } from "./content";

export type LinkedXpGained = { atomId: string; xp: number }[];

// The values just before the answer, so flagging a question can undo it.
export type ReviewEventBefore = {
  xp: number;
  intervalDays: number;
  dueOn: string;
  reviewCount: number;
  retryPending: boolean;
  lastQuestionId: string | null;
  clout: number;
};

// One row per answer. Rows are never edited except to set `voided`.
export const reviewEvent = pgTable(
  "review_event",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    // Made by the browser once per card showing; unique, so a double click cannot count twice.
    attemptId: text("attempt_id").notNull().unique(),
    // Plain text for now: the Better Auth `user` table arrives in checklist item 3
    // (schema/auth.ts), which adds the foreign-key reference to user.id.
    userId: text("user_id").notNull(),
    questionId: text("question_id")
      .notNull()
      .references(() => question.id),
    mainAtomId: text("main_atom_id")
      .notNull()
      .references(() => atom.id),
    kind: text("kind", { enum: ["first", "retry"] }).notNull(),
    confidenceStep: text("confidence_step", { enum: confidenceSteps }).notNull(),
    chosenOptionIds: jsonb("chosen_option_ids").$type<string[]>().notNull(),
    wasCorrect: boolean("was_correct").notNull(),
    mainXpGained: integer("main_xp_gained").notNull(),
    linkedXpGained: jsonb("linked_xp_gained").$type<LinkedXpGained>().notNull(),
    cloutChange: integer("clout_change").notNull(),
    before: jsonb("before").$type<ReviewEventBefore>().notNull(),
    // Exactly what submitAnswer returned, so a repeated submit can return it unchanged.
    result: jsonb("result").notNull(),
    learnerDate: date("learner_date", { mode: "string" }).notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true }).notNull().defaultNow(),
    voided: boolean("voided").notNull().default(false),
  },
  (table) => [
    // The end screen adds up one learner's events for today.
    index("review_event_user_date_index").on(table.userId, table.learnerDate),
    // Question rotation asks when this learner last answered each question of an atom.
    index("review_event_user_atom_index").on(table.userId, table.mainAtomId),
  ],
);
