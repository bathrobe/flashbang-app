import { eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { lecture } from "@/server/db/schema";

// Stage 1 has a single course, so a lecture number is enough to find a lecture.
export async function findLectureByNumber(lectureNumber: number) {
  const [foundLecture] = await database.select().from(lecture).where(eq(lecture.number, lectureNumber));
  return foundLecture ?? null;
}
