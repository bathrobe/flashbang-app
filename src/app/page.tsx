import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/account/GoogleSignInButton";
import { getSignedInUser, isAllowedLearner } from "@/server/access";

// The sign-in page: the app name and one button, nothing else from the app.
export default async function SignInPage({ searchParams }: PageProps<"/">) {
  const user = await getSignedInUser();
  if (isAllowedLearner(user)) redirect("/courses");

  const { signin } = await searchParams;
  const signInFailed = signin === "failed";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Flashbang</h1>
      {signInFailed && <p role="alert">Sign-in did not complete.</p>}
      <GoogleSignInButton />
    </main>
  );
}
