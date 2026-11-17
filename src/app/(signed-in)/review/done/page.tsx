import Link from "next/link";
import { getButtonLook } from "@/components/ui/buttonLook";
import { Panel } from "@/components/ui/Panel";

// Where a finished session lands. A placeholder: the real end screen (what was
// collected today, the session map) arrives with checklist item 14.
export default function ReviewDonePage() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <Panel>
        <p className="font-display text-xl">Session complete.</p>
        <Link href="/courses/athenian-democracy" className={getButtonLook("plain", "mt-4")}>
          Back to the course
        </Link>
      </Panel>
    </main>
  );
}
