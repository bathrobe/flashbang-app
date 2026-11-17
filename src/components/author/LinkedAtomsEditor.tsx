"use client";

import { Button } from "@/components/ui/Button";
import type { AtomChoice } from "@/server/queries/getAuthorLecture";
import { atomChoiceLabel } from "./atomChoiceLabel";
import { fieldLook } from "./fieldLook";
import type { FormLinkedAtom } from "./useQuestionForm";

type LinkedAtomsEditorProps = {
  linkedAtoms: FormLinkedAtom[];
  mainAtomId: string;
  atomChoices: AtomChoice[]; // every atom in the course; a link may reach an earlier lecture
  onChange: (linkedAtoms: FormLinkedAtom[]) => void;
};

// The atoms that also get a share of this question's XP, each with a weight
// above 0 and at most 1.
export function LinkedAtomsEditor({ linkedAtoms, mainAtomId, atomChoices, onChange }: LinkedAtomsEditorProps) {
  const changeLink = (index: number, changes: Partial<FormLinkedAtom>) =>
    onChange(linkedAtoms.map((link, linkIndex) => (linkIndex === index ? { ...link, ...changes } : link)));

  const addLink = () => {
    const firstFreeAtom = atomChoices.find(
      (choice) => choice.id !== mainAtomId && !linkedAtoms.some((link) => link.atomId === choice.id),
    );
    if (firstFreeAtom) onChange([...linkedAtoms, { atomId: firstFreeAtom.id, weight: "0.5" }]);
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-bold">Linked atoms and weights</legend>
      {linkedAtoms.length === 0 && <p className="text-ink-muted">None.</p>}
      {linkedAtoms.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <select
            value={link.atomId}
            onChange={(event) => changeLink(index, { atomId: event.target.value })}
            aria-label={`Linked atom ${index + 1}`}
            className={fieldLook}
          >
            {atomChoices.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {atomChoiceLabel(choice)}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={link.weight}
            onChange={(event) => changeLink(index, { weight: event.target.value })}
            aria-label={`Linked atom ${index + 1} weight`}
            className={`${fieldLook} w-24`}
          />
          <Button onClick={() => onChange(linkedAtoms.filter((_, linkIndex) => linkIndex !== index))}>Remove</Button>
        </div>
      ))}
      <div>
        <Button onClick={addLink}>Add linked atom</Button>
      </div>
    </fieldset>
  );
}
