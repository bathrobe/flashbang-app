import { asc, eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, lecture } from "@/server/db/schema";

// Every atom in the course, for the author page's main-atom and linked-atom
// pickers. A linked atom may belong to an earlier lecture.
export async function loadAtomChoices() {
  return database
    .select({ id: atom.id, sentence: atom.sentence, lectureNumber: lecture.number, position: atom.position })
    .from(atom)
    .innerJoin(lecture, eq(lecture.id, atom.lectureId))
    .orderBy(asc(lecture.number), asc(atom.position));
}
