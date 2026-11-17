import { SignOutButton } from "@/components/account/SignOutButton";
import { requireLearner } from "@/server/access";

// Placeholder until the courses view is built (checklist item 8).
export default async function CoursesPage() {
  const user = await requireLearner();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Courses</h1>
      <p>Signed in as {user.name}</p>
      <SignOutButton />
    </main>
  );
}
