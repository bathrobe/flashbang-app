import type { SaveState } from "./useAuthorAction";

// "Saved", or "Save failed" with every reason, beside a Save button.
export function SaveStatus({ saveState }: { saveState: SaveState }) {
  if (saveState.kind === "idle") return null;
  if (saveState.kind === "saving") return <p aria-live="polite">Saving…</p>;
  if (saveState.kind === "saved") return <p aria-live="polite" className="font-bold">Saved</p>;

  return (
    <div role="alert">
      <p className="font-bold">Save failed</p>
      <ul className="list-disc pl-5">
        {saveState.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </div>
  );
}
