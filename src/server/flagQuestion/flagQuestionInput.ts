import { z } from "zod";

export const flagNoteMaxLength = 500;

// What the browser sends when the learner flags a question. `attemptId` is
// present only when flagging from the feedback panel (the answer to undo).
export const flagQuestionInputShape = z.object({
  questionId: z.string().min(1),
  // Optional; trimmed, cut to the cap, and an empty note saved as none.
  note: z
    .string()
    .optional()
    .transform((note) => note?.trim().slice(0, flagNoteMaxLength) || null),
  attemptId: z.string().min(1).max(100).optional(),
  // True inside `/review?all=1`, so the returned badge count ignores the eased-return cap.
  all: z.boolean().optional(),
});

export type FlagQuestionInput = z.infer<typeof flagQuestionInputShape>;
