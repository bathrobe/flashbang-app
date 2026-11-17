// The lecture's atoms as plain sentences, to be read once before the first
// review. Kept as its own component so the Stage 2 intake can replace it.
export function AtomList({ lectureNumber, atoms }: { lectureNumber: number; atoms: { atomId: string; sentence: string }[] }) {
  return (
    <section>
      <h1 className="font-display text-2xl">The ideas in Lecture {lectureNumber}</h1>
      <p className="mt-1 text-ink-muted">Read each one once. The questions start when you press Begin.</p>
      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6">
        {atoms.map((atom) => (
          <li key={atom.atomId}>{atom.sentence}</li>
        ))}
      </ol>
    </section>
  );
}
