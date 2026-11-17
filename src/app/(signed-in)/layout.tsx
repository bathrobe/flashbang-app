import { HudProvider } from "@/components/hud/HudProvider";
import { VisitReporter } from "@/components/hud/VisitReporter";
import { Navbar } from "@/components/navbar/Navbar";
import { WelcomeBack } from "@/components/welcome/WelcomeBack";
import { isAdmin, requireLearner } from "@/server/access";
import { startEasedReturnIfAway } from "@/server/easedReturn";
import { ensureLearnerState } from "@/server/learnerState";
import { getHudValues } from "@/server/queries/getHudValues";
import { getNextDueDate } from "@/server/queries/getNextDueDate";
import { getWelcomeBack } from "@/server/queries/getWelcomeBack";

// Every page in the (signed-in) folder goes through this check first: signed
// out leads to the sign-in page, a non-allowed account to "not open yet".
// The folder name in brackets does not appear in addresses.
export default async function SignedInLayout({ children }: LayoutProps<"/">) {
  const user = await requireLearner();
  await ensureLearnerState(user.id);
  // Checked here as well as in noteVisit, so the very first page after a gap
  // already has the short count and the welcome-back message.
  await startEasedReturnIfAway(user.id);
  const [hudValues, nextDueDate, welcomeBack] = await Promise.all([
    getHudValues(user.id),
    getNextDueDate(user.id),
    getWelcomeBack(user.id),
  ]);

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
      {welcomeBack && <WelcomeBack firstName={user.name?.split(" ")[0] ?? ""} {...welcomeBack} />}
      {children}
    </HudProvider>
  );
}
