import { z } from "zod";

// The shape of one lecture's content file (content/lectures/NN-slug.json).
// The file is the source of truth for a lecture: atoms, terms and people, each
// with whatever questions were written for it. Ids are stable so that learner
// progress survives an edit.

export const fileQuestionFormats = ["multiple_choice", "multi_select", "true_false", "fill_blank"] as const;
export const questionRungs = ["recognise", "recall", "apply"] as const;

const text = (name: string) => z.string(`${name} is missing`).trim().min(1, `${name} is empty`);

const optionShape = z.object({ text: text("text"), isCorrect: z.boolean("must be true or false") });

const questionShape = z.object({
  id: text("id"),
  format: z.enum(fileQuestionFormats, `must be one of: ${fileQuestionFormats.join(", ")}`),
  rung: z.enum(questionRungs, `must be one of: ${questionRungs.join(", ")}`),
  prompt: text("prompt"),
  options: z.array(optionShape, "must be a list"),
  // "never" keeps the collectible's image off this question (it would give the answer away).
  imageUse: z.enum(["optional", "never"]).default("optional"),
  // People are asked both ways round; the two directions are allowed to share words.
  direction: z.enum(["name_to_fact", "fact_to_name"]).optional(),
  // A reason, in words, why a warning on this question is fine. Silences its warnings.
  checkedByHand: z.string().trim().min(1).optional(),
});

const imageShape = z.object({ path: text("path"), caption: text("caption"), credit: text("credit") });
const matchPairShape = z.object({ front: text("front"), back: text("back") });

const atomShape = z.object({
  id: text("id"),
  sentence: text("sentence"),
  blurb: text("blurb"),
  quote: z.object({ text: text("text"), timestamp: text("timestamp") }),
  transcriptRef: text("transcriptRef"),
  image: imageShape.optional(),
  matchPair: matchPairShape.optional(),
  questions: z.array(questionShape, "must be a list"),
});

const termShape = z.object({
  id: text("id"),
  word: text("word"),
  greek: z.string().trim().optional(),
  meaning: text("meaning"),
  description: text("description"),
  transcriptRef: text("transcriptRef"),
});

const personShape = z.object({
  id: text("id"),
  name: text("name"),
  role: text("role"),
  origin: z.string().trim().optional(),
  dates: z.string().trim().optional(),
  description: text("description"),
  transcriptRef: text("transcriptRef"),
  image: imageShape.optional(),
  matchPair: matchPairShape.optional(),
  questions: z.array(questionShape, "must be a list").default([]),
});

export const lectureFileShape = z.object({
  lecture: z.object({ number: z.number("must be a number").int().min(1), title: text("title") }),
  atoms: z.array(atomShape, "must be a list"),
  terms: z.array(termShape, "must be a list").default([]),
  people: z.array(personShape, "must be a list").default([]),
});

export type LectureFile = z.infer<typeof lectureFileShape>;
export type FileQuestion = LectureFile["atoms"][number]["questions"][number];

export type LectureFileResult = { ok: true; lectureFile: LectureFile } | { ok: false; errors: string[] };

// Returns the cleaned file, or every reason its shape is wrong, in plain words.
export function checkLectureFileShape(candidate: unknown): LectureFileResult {
  const parsed = lectureFileShape.safeParse(candidate);
  if (parsed.success) return { ok: true, lectureFile: parsed.data };
  const errors = parsed.error.issues.map((issue) => `${issue.path.join(".") || "file"} ${issue.message}`);
  return { ok: false, errors };
}
