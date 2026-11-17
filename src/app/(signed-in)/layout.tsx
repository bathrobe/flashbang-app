import { HudProvider } from "@/components/hud/HudProvider";
import { VisitReporter } from "@/components/hud/VisitReporter";
import { Navbar } from "@/components/navbar/Navbar";
import { isAdmin, requireLearner } from "@/server/access";
import { ensureLearnerState } from "@/server/learnerState";
import { getHudValues } from "@/server/queries/getHudValues";
import { getNextDueDate } from "@/server/queries/getNextDueDate";

// Every page in the (signed-in) folder goes through this check first: signed
// out leads to the sign-in page, a non-allowed account to "not open yet".
// The folder name in brackets does not appear in addresses.
export default async function SignedInLayout({ children }: LayoutProps<"/">) {
  const user = await requireLearner();
  await ensureLearnerState(user.id);
  const [hudValues, nextDueDate] = await Promise.all([getHudValues(user.id), getNextDueDate(user.id)]);

  return (
    <HudProvider valuesFromServer={hudValues}>
      <VisitReporter />
      <Navbar
        userName={user.name}
        userImage={user.image ?? null}
        nextDueDate={nextDueDate}
        // Decided here on the server, so a non-admin's browser never hears about the link.
        showAuthorLink={isAdmin(user)}
      />
      {children}
    </HudProvider>
  );
}
