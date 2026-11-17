import { formatCalendarDate } from "@/lib/formatCalendarDate";

type PublishBarInput = {
  lectureStatus: "draft" | "published";
  draftQuestionCount: number;
  publishedOn: string | null; // "YYYY-MM-DD", null while a draft
};

// What the Publish bar says and whether its button shows.
// - Draft lecture: "Publish lecture".
// - Published with drafts waiting: "Publish drafts (N)".
// - Published with nothing waiting: no button, just "Published <date>".
export function describePublishBar({ lectureStatus, draftQuestionCount, publishedOn }: PublishBarInput) {
  const publishedLine = publishedOn ? `Published ${formatCalendarDate(publishedOn)}` : null;
  if (lectureStatus === "draft") return { buttonLabel: "Publish lecture", publishedLine: null };
  if (draftQuestionCount === 0) return { buttonLabel: null, publishedLine };
  return { buttonLabel: `Publish drafts (${draftQuestionCount})`, publishedLine };
}
