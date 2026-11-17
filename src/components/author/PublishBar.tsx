"use client";

import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { publishLecture } from "@/server/actions/author/publishLecture";
import { describePublishBar } from "./describePublishBar";
import { useAuthorAction } from "./useAuthorAction";

type PublishBarProps = {
  lectureId: string;
  lectureStatus: "draft" | "published";
  draftQuestionCount: number;
  publishedOn: string | null;
};

// One button publishes the whole lecture. On success the page re-reads its
// data (inside useAuthorAction), so the label and statuses below catch up.
export function PublishBar({ lectureId, lectureStatus, draftQuestionCount, publishedOn }: PublishBarProps) {
  const { saveState, runAction, isBusy } = useAuthorAction();
  const { buttonLabel, publishedLine } = describePublishBar({ lectureStatus, draftQuestionCount, publishedOn });

  return (
    <Panel className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {buttonLabel && (
          <Button variant="accent-1" onClick={() => runAction(() => publishLecture({ lectureId }))} disabled={isBusy}>
            {buttonLabel}
          </Button>
        )}
        {publishedLine && <p className="font-bold">{publishedLine}</p>}
        {saveState.kind === "saving" && <p aria-live="polite">Publishing…</p>}
      </div>
      {saveState.kind === "failed" && (
        <div role="alert">
          <p className="font-bold">Can&apos;t publish yet</p>
          <ul className="list-disc pl-5">
            {saveState.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
