// The look of an atom token, shared by AtomToken (a browser component) and the
// empty slots in LectureRow (a server component). Kept in a plain file because
// a server component cannot read plain values out of a "use client" file.

// Full class names spelled out so Tailwind finds them. Same square at every
// level; only the material changes (paper, bronze, silver, gold, prismatic).
const lookByLevel: Record<number, string> = {
  1: "bg-level-1-fill border-level-1-edge text-level-1-ink",
  2: "bg-level-2-fill border-level-2-edge text-level-2-ink",
  3: "bg-level-3-fill border-level-3-edge text-level-3-ink",
  4: "bg-level-4-fill border-level-4-edge text-level-4-ink",
  5: "bg-level-5-fill border-level-5-edge text-level-5-ink",
};

export const atomTokenSquare = "flex h-9 w-9 items-center justify-center rounded-frame border-thick";

// Level 5 and above all share the level-5 look.
export function getAtomTokenLook(level: number) {
  return lookByLevel[Math.min(Math.max(level, 1), 5)];
}

// The same level looks split into parts, for the XP bar's segments: an empty
// segment keeps the panel colour inside the level's edge.
const edgeByLevel: Record<number, string> = {
  1: "border-level-1-edge",
  2: "border-level-2-edge",
  3: "border-level-3-edge",
  4: "border-level-4-edge",
  5: "border-level-5-edge",
};
const fillByLevel: Record<number, string> = {
  1: "bg-level-1-fill",
  2: "bg-level-2-fill",
  3: "bg-level-3-fill",
  4: "bg-level-4-fill",
  5: "bg-level-5-fill",
};

export function getLevelEdgeAndFill(level: number) {
  const lookLevel = Math.min(Math.max(level, 1), 5);
  return { edge: edgeByLevel[lookLevel], fill: fillByLevel[lookLevel] };
}
