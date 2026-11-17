"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setSoundEnabled } from "@/lib/sound";
import type { HudValues } from "@/server/queries/getHudValues";

// The heads-up values (clout, level, inbox count, sound) for every signed-in
// page. They start from the server and are then changed in the browser, so the
// navbar can move during a review session without reloading the page.

type Hud = HudValues & {
  // Merge in new values, e.g. updateHud({ clout: result.cloutAfter, dueCount: 3 }).
  updateHud: (changes: Partial<HudValues>) => void;
};

const HudContext = createContext<Hud | null>(null);

export function HudProvider({ valuesFromServer, children }: { valuesFromServer: HudValues; children: ReactNode }) {
  const [values, setValues] = useState(valuesFromServer);
  const [lastServerText, setLastServerText] = useState(JSON.stringify(valuesFromServer));

  // When the server sends different numbers (after router.refresh(), say),
  // take them. React allows setting state during render for exactly this:
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const serverText = JSON.stringify(valuesFromServer);
  if (serverText !== lastServerText) {
    setLastServerText(serverText);
    setValues(valuesFromServer);
  }

  // Keep playSound (src/lib/sound.ts) in step with the speaker toggle.
  useEffect(() => setSoundEnabled(values.soundOn), [values.soundOn]);

  function updateHud(changes: Partial<HudValues>) {
    setValues((currentValues) => ({ ...currentValues, ...changes }));
  }

  return <HudContext.Provider value={{ ...values, updateHud }}>{children}</HudContext.Provider>;
}

export function useHud(): Hud {
  const hud = useContext(HudContext);
  if (!hud) throw new Error("useHud must be used inside <HudProvider> (the signed-in layout).");
  return hud;
}
