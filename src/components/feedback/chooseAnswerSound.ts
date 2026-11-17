import type { SoundName } from "@/lib/sound";

type AnswerSoundInput = {
  wasCorrect: boolean;
  isAllInWipe: boolean;
  hasLevelUp: boolean; // any atom or the learner levelled on this answer
  animate: boolean;
};

// The sound to play the moment the feedback panel appears.
// - An All in wipe gets its own sting instead of the plain wrong sound.
// - When the bars animate, the level-up jingle comes later, as a bar levels.
// - Without animation (reduced motion) the bars are already full, so the
//   level-up jingle plays now, in place of the correct chime (a level-up only
//   ever follows a correct answer), keeping it to one sound at a time.
export function chooseAnswerSound({ wasCorrect, isAllInWipe, hasLevelUp, animate }: AnswerSoundInput): SoundName {
  if (isAllInWipe) return "all-in-wipe";
  if (!wasCorrect) return "wrong";
  if (hasLevelUp && !animate) return "level-up";
  return "correct";
}
