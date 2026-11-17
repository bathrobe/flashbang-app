import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { course } from "./course";

const newId = () => crypto.randomUUID();

export type QuestionOption = { id: string; text: string; isCorrect: boolean };

export const lecture = pgTable(
  "lecture",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id),
    number: integer("number").notNull(),
    title: text("title").notNull(),
    status: text("status", { enum: ["draft", "published"] })
      .notNull()
      .default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [unique("lecture_course_number_unique").on(table.courseId, table.number)],
);

export const atom = pgTable(
  "atom",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    lectureId: text("lecture_id")
      .notNull()
      .references(() => lecture.id),
    position: integer("position").notNull(),
    sentence: text("sentence").notNull(),
    transcriptRef: text("transcript_ref"),
    status: text("status", { enum: ["active", "retired"] })
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("atom_lecture_index").on(table.lectureId)],
);

export const question = pgTable(
  "question",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    mainAtomId: text("main_atom_id")
      .notNull()
      .references(() => atom.id),
    format: text("format", { enum: ["multiple_choice", "multi_select", "true_false"] }).notNull(),
    prompt: text("prompt").notNull(),
    options: jsonb("options").$type<QuestionOption[]>().notNull(),
    explanation: text("explanation").notNull(),
    isIntroductory: boolean("is_introductory").notNull().default(false),
    imagePath: text("image_path"),
    imageCredit: text("image_credit"),
    imageKind: text("image_kind", { enum: ["sourced", "generated"] }),
    status: text("status", { enum: ["draft", "active", "flagged", "deleted"] })
      .notNull()
      .default("draft"),
    flagNote: text("flag_note"),
    flaggedAt: timestamp("flagged_at", { withTimezone: true }),
    // Plain text for now: the Better Auth `user` table arrives in checklist item 3
    // (schema/auth.ts), which adds the foreign-key reference to user.id.
    flaggedByUserId: text("flagged_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("question_main_atom_index").on(table.mainAtomId)],
);

// A question also gives a share of its XP to each linked atom (weight above 0, at most 1).
export const questionLink = pgTable(
  "question_link",
  {
    questionId: text("question_id")
      .notNull()
      .references(() => question.id),
    atomId: text("atom_id")
      .notNull()
      .references(() => atom.id),
    weight: doublePrecision("weight").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.questionId, table.atomId] }),
    index("question_link_atom_index").on(table.atomId),
  ],
);
