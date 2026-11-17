import { SignOutButton } from "@/components/account/SignOutButton";
import { Panel } from "@/components/ui/Panel";

// Shown to any signed-in account that is not on ALLOWED_EMAILS.
// Deliberately nothing else: no fields, no links into the app.
export default function NotOpenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Panel className="flex flex-col items-center gap-6 p-8">
        <p>This isn&apos;t open yet.</p>
        <SignOutButton />
      </Panel>
    </main>
  );
}
