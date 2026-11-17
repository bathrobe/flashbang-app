"use client";

import { useHud } from "@/components/hud/HudProvider";
import { setSoundOn } from "@/server/actions/setSoundOn";

// The speaker button. The choice is saved on the account (learner_state.sound_on).
export function SoundToggle() {
  const { soundOn, updateHud } = useHud();

  async function toggleSound() {
    const newSoundOn = !soundOn;
    updateHud({ soundOn: newSoundOn }); // show it at once ...
    try {
      await setSoundOn(newSoundOn);
    } catch {
      updateHud({ soundOn: !newSoundOn }); // ... and put it back if the save failed
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Sound is on. Turn sound off" : "Sound is off. Turn sound on"}
      className="flex cursor-pointer items-center rounded-frame border-thick border-outline bg-panel p-1"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {soundOn ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="m16 9 6 6m0-6-6 6" />}
      </svg>
    </button>
  );
}
