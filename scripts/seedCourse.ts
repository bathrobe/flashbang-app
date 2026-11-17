import { eq } from "drizzle-orm";
import { closeDatabaseConnections, database } from "../src/server/db/client";
import { course, lecture } from "../src/server/db/schema";
import { exitWithReadableError } from "./exitWithReadableError";
import { lectureTitles } from "./lectureTitles";

// Inserts the course and its 24 draft lectures. Safe to run twice: rows that
// already exist are left alone ("on conflict do nothing").

const courseSlug = "athenian-democracy";

async function main() {
  const insertedCourses = await database
    .insert(course)
    .values({
      slug: courseSlug,
      title: "Athenian Democracy",
      lecturer: "Robert Garland",
      lectureCount: lectureTitles.length,
    })
    .onConflictDoNothing({ target: course.slug })
    .returning({ id: course.id });

  const [seededCourse] = await database.select().from(course).where(eq(course.slug, courseSlug));

  const insertedLectures = await database
    .insert(lecture)
    .values(
      lectureTitles.map((title, position) => ({
        courseId: seededCourse.id,
        number: position + 1,
        title,
        status: "draft" as const,
      })),
    )
    .onConflictDoNothing({ target: [lecture.courseId, lecture.number] })
    .returning({ id: lecture.id });

  const allLectures = await database.select().from(lecture).where(eq(lecture.courseId, seededCourse.id));
  const draftCount = allLectures.filter((row) => row.status === "draft").length;
  await closeDatabaseConnections();

  console.log(`Inserted ${insertedCourses.length} course and ${insertedLectures.length} lectures.`);
  console.log(`"${seededCourse.title}" now has ${allLectures.length} lectures, ${draftCount} of them draft.`);
}

main().catch(exitWithReadableError);
