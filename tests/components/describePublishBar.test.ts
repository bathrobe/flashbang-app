import { describe, expect, it } from "vitest";
import { describePublishBar } from "@/components/author/describePublishBar";

describe("describePublishBar", () => {
  it("offers Publish lecture on a draft lecture", () => {
    expect(describePublishBar({ lectureStatus: "draft", draftQuestionCount: 6, publishedOn: null })).toEqual({
      buttonLabel: "Publish lecture",
      publishedLine: null,
    });
  });

  it("counts the waiting drafts on a published lecture", () => {
    const bar = describePublishBar({ lectureStatus: "published", draftQuestionCount: 1, publishedOn: "2026-11-16" });
    expect(bar).toEqual({ buttonLabel: "Publish drafts (1)", publishedLine: "Published Monday 16 November" });
  });

  it("hides the button when a published lecture has no drafts", () => {
    const bar = describePublishBar({ lectureStatus: "published", draftQuestionCount: 0, publishedOn: "2026-11-16" });
    expect(bar.buttonLabel).toBeNull();
    expect(bar.publishedLine).toBe("Published Monday 16 November");
  });
});
