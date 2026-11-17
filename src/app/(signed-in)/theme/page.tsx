import { ButtonsSection } from "@/components/theme/ButtonsSection";
import { CloutSection } from "@/components/theme/CloutSection";
import { ConfidenceSection } from "@/components/theme/ConfidenceSection";
import { DoorSection } from "@/components/theme/DoorSection";
import { FeedbackSection } from "@/components/theme/FeedbackSection";
import { LevelLooksSection } from "@/components/theme/LevelLooksSection";
import { NavbarSection } from "@/components/theme/NavbarSection";
import { OptionStatesSection } from "@/components/theme/OptionStatesSection";
import { XpBarsSection } from "@/components/theme/XpBarsSection";
import { requireAdmin } from "@/server/access";

// The theme playground (admin only): the real components, with fixed sample
// data, in every state. Change a value in src/app/themes/starting.css and this
// page shows the result everywhere at once. Check text contrast with
// `pnpm exec tsx scripts/checkContrast.ts`.
export default async function ThemePlaygroundPage() {
  await requireAdmin({ calledFrom: "page" });

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
      <h1 className="font-display text-2xl">Theme playground</h1>
      <OptionStatesSection />
      <ConfidenceSection />
      <XpBarsSection />
      <LevelLooksSection />
      <NavbarSection />
      <FeedbackSection />
      <CloutSection />
      <DoorSection />
      <ButtonsSection />
    </main>
  );
}
