"use client";

import { useEffect, useRef, useState } from "react";
import type { CardImage } from "@/server/cardTypes";

// A question's picture with its credit line beneath. If the file fails to
// load, the picture AND its credit vanish, so the card shows no gap and can
// still be answered. A plain <img> (not next/image) because the path is just a
// file in public/question-images/ typed on the author page.
export function QuestionImage({ image }: { image: CardImage | null }) {
  // The path that failed, not a plain true/false, so a new image gets a fresh try.
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const imageElement = useRef<HTMLImageElement>(null);

  // An image can fail before React starts listening for errors (when the page
  // arrives as server HTML). A finished image with no width is that case.
  useEffect(() => {
    const element = imageElement.current;
    if (image && element?.complete && element.naturalWidth === 0) setFailedPath(image.path);
  }, [image]);

  if (!image || failedPath === image.path) return null;

  const creditLine = image.kind === "generated" ? "Generated illustration" : image.credit;

  return (
    <figure className="flex flex-col gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element -- see the comment above */}
      <img
        ref={imageElement}
        src={image.path}
        // There is no alt field, and describing the picture could give the answer away.
        alt="Illustration for this question"
        className="max-h-64 w-auto max-w-full self-start border-thick border-outline object-contain"
        onError={() => setFailedPath(image.path)}
      />
      {creditLine && <figcaption className="text-sm text-ink-muted">{creditLine}</figcaption>}
    </figure>
  );
}
