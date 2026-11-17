"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Panel } from "./Panel";

type PopoverProps = {
  trigger: ReactNode; // what the button shows
  triggerLabel: string; // read out by screen readers
  triggerClassName?: string;
  children: ReactNode; // what the opened panel holds
  openOnHover?: boolean; // also open while the pointer is over it
  align?: "left" | "right"; // which edge of the trigger the panel lines up with
  panelWidthClassName?: string;
};

// A button that opens a small panel beneath itself. Clicking anywhere else,
// or pressing Escape, closes it. With openOnHover, pointing at it opens it too,
// and a click opens rather than toggles (so hover-then-click never closes it).
export function Popover({
  trigger,
  triggerLabel,
  triggerClassName = "",
  children,
  openOnHover = false,
  align = "right",
  // max-w keeps the panel inside a narrow window.
  panelWidthClassName = "w-max max-w-[80vw]",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openOnHover ? () => setIsOpen(true) : undefined}
      onMouseLeave={openOnHover ? () => setIsOpen(false) : undefined}
    >
      <button
        type="button"
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(openOnHover ? true : !isOpen)}
        className={`cursor-pointer ${triggerClassName}`}
      >
        {trigger}
      </button>
      {isOpen && (
        <Panel
          role="dialog"
          className={`absolute top-full z-10 mt-2 ${panelWidthClassName} ${align === "left" ? "left-0" : "right-0"}`}
        >
          {children}
        </Panel>
      )}
    </div>
  );
}
