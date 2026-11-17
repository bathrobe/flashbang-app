"use client";

import Link from "next/link";
import { useHud } from "@/components/hud/HudProvider";
import { AccountMenu } from "./AccountMenu";
import { InboxButton } from "./InboxButton";
import { SoundToggle } from "./SoundToggle";

type NavbarProps = {
  userName: string;
  userImage: string | null;
  nextDueDate: string | null;
  showAuthorLink: boolean;
};

// On every signed-in page. flex-wrap lets it fold onto two lines in a narrow window.
export function Navbar({ userName, userImage, nextDueDate, showAuthorLink }: NavbarProps) {
  const { learnerLevel, clout } = useHud();

  return (
    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-thick border-outline bg-panel px-4 py-2">
      <Link href="/courses" className="font-display text-xl">
        Flashbang
      </Link>
      {showAuthorLink && (
        <Link href="/author" className="underline">
          Author
        </Link>
      )}

      {/* ml-auto pushes everything after it to the right-hand side. */}
      <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2">
        <NavbarNumber label="Level" value={learnerLevel} valueClassName="text-xp" />
        <NavbarNumber label="Clout" value={clout} valueClassName="text-clout" />
        <InboxButton nextDueDate={nextDueDate} />
        <SoundToggle />
        <AccountMenu userName={userName} userImage={userImage} />
      </div>
    </nav>
  );
}

function NavbarNumber({ label, value, valueClassName }: { label: string; value: number; valueClassName: string }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-sm font-bold">{label}</span>
      <span className={`font-number text-lg ${valueClassName}`}>{value}</span>
    </span>
  );
}
