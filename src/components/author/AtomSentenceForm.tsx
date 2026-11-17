"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { saveAtom } from "@/server/actions/author/saveAtom";
import { fieldLook, labelLook } from "./fieldLook";
import { SaveStatus } from "./SaveStatus";
import { useAuthorAction } from "./useAuthorAction";

// The atom's sentence as a text field, with its own Save.
export function AtomSentenceForm({ atomId, savedSentence }: { atomId: string; savedSentence: string }) {
  const [sentence, setSentence] = useState(savedSentence);
  const { saveState, runAction, isBusy } = useAuthorAction();

  return (
    <div className="flex flex-col gap-2">
      <label className={labelLook}>
        Sentence
        <textarea
          value={sentence}
          onChange={(event) => setSentence(event.target.value)}
          rows={2}
          className={`${fieldLook} font-normal`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="accent-3" onClick={() => runAction(() => saveAtom({ atomId, sentence }))} disabled={isBusy}>
          Save sentence
        </Button>
        <SaveStatus saveState={saveState} />
      </div>
    </div>
  );
}
