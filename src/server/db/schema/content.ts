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
import { user } from "./auth";
import { course } from "./course";

const newId = () => crypto.randomUUID();

export type QuestionOption = { id: string; text: string; isCorrect: boolean };

// The three kinds of card a lecture yields. All three live in the `atom` table,
// so progress, sessions and XP treat a term or a person exactly like an atom.
export const cardKinds = ["atom", "term", "person"] as const;

// Everything about a card beyond its sentence and blurb, as written in the
// lecture file (quote, image, match pair, a term's word, a person's dates…).
export type CardDetails = Record<string, unknown>;

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
    kind: text("kind", { enum: cardKinds }).notNull().default("atom"),
    // One or two more sentences. Part of the card, and shown as feedback.
    blurb: text("blurb"),
    details: jsonb("details").$type<CardDetails>(),
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
    format: text("format", { enum: ["multiple_choice", "multi_select", "true_false", "fill_blank"] }).notNull(),
    // recognise, recall or apply. Empty on questions made before lecture files.
    rung: text("rung", { enum: ["recognise", "recall", "apply"] }),
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
    flaggedByUserId: text("flagged_by_user_id").references(() => user.id),
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
