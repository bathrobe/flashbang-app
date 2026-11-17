"use client";

import { SignOutButton } from "@/components/account/SignOutButton";
import { Popover } from "@/components/ui/Popover";

// The learner's name and picture from their Google account. Opens a menu with sign out.
export function AccountMenu({ userName, userImage }: { userName: string; userImage: string | null }) {
  const trigger = (
    <span className="flex items-center gap-2">
      <Avatar userName={userName} userImage={userImage} />
      <span className="max-w-40 truncate font-bold">{userName}</span>
    </span>
  );

  return (
    <Popover trigger={trigger} triggerLabel={`Account menu for ${userName}`}>
      <div className="flex flex-col items-start gap-3">
        <p>Signed in as {userName}</p>
        <SignOutButton />
      </div>
    </Popover>
  );
}

const avatarLook = "h-8 w-8 rounded-full border-thick border-outline";

// The Google picture, or a circle with the first initial when there is none.
function Avatar({ userName, userImage }: { userName: string; userImage: string | null }) {
  if (userImage) {
    // A plain <img>: next/image would need Google's image host added to the config.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={userImage} alt="" referrerPolicy="no-referrer" className={avatarLook} />;
  }

  const firstInitial = userName.trim().charAt(0).toUpperCase() || "?";
  return (
    <span className={`flex items-center justify-center bg-accent-4 font-display text-sm text-accent-4-ink ${avatarLook}`}>
      {firstInitial}
    </span>
  );
}
