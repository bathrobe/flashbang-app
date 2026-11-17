import type { ComponentProps } from "react";

// A framed "menu window": thick outline, hard offset shadow, square corners.
// Cards, feedback and popovers all sit in one of these.
export function Panel({ className = "", ...divProps }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-frame border-thick border-outline bg-panel p-4 text-ink shadow-hard ${className}`}
      {...divProps}
    />
  );
}
