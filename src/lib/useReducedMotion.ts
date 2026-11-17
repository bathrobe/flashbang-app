"use client";

import { useSyncExternalStore } from "react";

// True when the system asks for reduced motion (macOS: Accessibility > Display >
// Reduce motion). Updates live if the setting changes. On the server there is
// no system setting, so it is false there.
// useSyncExternalStore is React's tool for reading a value that lives outside
// React: https://react.dev/reference/react/useSyncExternalStore

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mediaQueryList = window.matchMedia(reducedMotionQuery);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

function readFromBrowser() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function readOnServer() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, readFromBrowser, readOnServer);
}
