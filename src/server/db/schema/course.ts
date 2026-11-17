import { integer, pgTable, text } from "drizzle-orm/pg-core";

// One row per course. Stage 1 has exactly one: Athenian Democracy.
export const course = pgTable("course", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  lecturer: text("lecturer").notNull(),
  lectureCount: integer("lecture_count").notNull(),
});
