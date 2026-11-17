import { afterEach, describe, expect, it, vi } from "vitest";
import { getSoundPath, playSound, setSoundEnabled } from "@/lib/sound";

// A stand-in for the browser's Audio: records what was played.
function installFakeAudio(playResult: () => Promise<void>) {
  const playedPaths: string[] = [];
  vi.stubGlobal("Audio", function FakeAudio(path: string) {
    return { play: () => { playedPaths.push(path); return playResult(); } };
  });
  return playedPaths;
}

afterEach(() => {
  vi.unstubAllGlobals();
  setSoundEnabled(false);
});

describe("playSound", () => {
  it("does nothing and does not throw where there is no browser", () => {
    setSoundEnabled(true);
    expect(() => playSound("correct")).not.toThrow();
  });

  it("plays the named file when sound is on", () => {
    const playedPaths = installFakeAudio(() => Promise.resolve());
    setSoundEnabled(true);
    playSound("level-up");
    expect(playedPaths).toEqual(["/sounds/level-up.mp3"]);
  });

  it("stays silent when sound is off", () => {
    const playedPaths = installFakeAudio(() => Promise.resolve());
    setSoundEnabled(false);
    playSound("wrong");
    expect(playedPaths).toEqual([]);
  });

  it("swallows a blocked or missing sound", async () => {
    installFakeAudio(() => Promise.reject(new Error("NotAllowedError")));
    setSoundEnabled(true);
    expect(() => playSound("all-in-wipe")).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0)); // an unhandled rejection would fail the run
  });

  it("names every sound file by its event", () => {
    expect(getSoundPath("door-unveil")).toBe("/sounds/door-unveil.mp3");
  });
});
