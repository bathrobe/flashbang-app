import Link from "next/link";
import { getButtonLook } from "@/components/ui/buttonLook";

type EndScreenControlsProps = {
  backHref: string; // the course view
  keepGoingCount: number; // due atoms the eased-return short session held back
};

// The way out of the end screen. After a short welcome-back session with more
// still due, two choices of exactly the same look and size: stopping is as
// easy as carrying on. Otherwise the single "Back to the course".
export function EndScreenControls({ backHref, keepGoingCount }: EndScreenControlsProps) {
  if (keepGoingCount === 0) {
    return (
      <Link href={backHref} className={getButtonLook("accent-1", "self-start")}>
        Back to the course
      </Link>
    );
  }

  const sameLook = getButtonLook("accent-1", "flex-1");
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/review?all=1" className={sameLook}>
        Keep going (<span className="font-number">{keepGoingCount}</span>)
      </Link>
      <Link href={backHref} className={sameLook}>
        Done for today
      </Link>
    </div>
  );
}
