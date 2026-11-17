import type { ReactNode } from "react";

// One group on the theme playground: a heading and its samples.
// `group` becomes data-playground="..." so a script can find each group in the HTML.
export function PlaygroundSection({ title, group, children }: { title: string; group: string; children: ReactNode }) {
  return (
    <section data-playground={group} className="flex flex-col gap-3">
      <h2 className="border-b-thick border-outline pb-1 font-display text-xl">{title}</h2>
      {children}
    </section>
  );
}

// A small caption above one sample, naming the state shown.
export function SampleLabel({ children }: { children: ReactNode }) {
  return <p className="font-number text-xs text-ink-muted">{children}</p>;
}
