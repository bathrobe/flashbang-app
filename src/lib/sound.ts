// The app's five sounds, played with a plain HTMLAudioElement (no library).
// Files live in public/sounds/ (sources in public/sounds/CREDITS.md).

export type SoundName = "correct" | "wrong" | "level-up" | "all-in-wipe" | "door-unveil";

// Mirrors the learner's speaker toggle. HudProvider keeps it in step with
// useHud().soundOn, so any code can call playSound without reading the HUD.
// Starts off: nothing plays until the HUD has said sound is on.
let soundEnabled = false;

export function setSoundEnabled(isOn: boolean) {
  soundEnabled = isOn;
}

export function getSoundPath(name: SoundName): string {
  return `/sounds/${name}.mp3`;
}

// Plays one sound, or does nothing when sound is off or there is no browser
// (server rendering). Never throws: if the browser blocks autoplay or the
// file is missing, play() rejects and we ignore it (spec: "Ignored silently").
export function playSound(name: SoundName) {
  if (!soundEnabled || typeof Audio === "undefined") return;
  try {
    const audio = new Audio(getSoundPath(name));
    audio.play()?.catch(() => {});
  } catch {
    // Some browsers throw instead of rejecting; same answer: stay silent.
  }
}
