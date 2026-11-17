"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Panel } from "./Panel";

type PopoverProps = {
  trigger: ReactNode; // what the button shows
  triggerLabel: string; // read out by screen readers
  triggerClassName?: string;
  children: ReactNode; // what the opened panel holds
};

// A button that opens a small panel beneath itself. Clicking anywhere else,
// or pressing Escape, closes it.
export function Popover({ trigger, triggerLabel, triggerClassName = "", children }: PopoverProps) {
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
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer ${triggerClassName}`}
      >
        {trigger}
      </button>
      {isOpen && (
        // max-w keeps the panel inside a narrow window.
        <Panel role="dialog" className="absolute right-0 top-full z-10 mt-2 w-max max-w-[80vw]">
          {children}
        </Panel>
      )}
    </div>
  );
}
