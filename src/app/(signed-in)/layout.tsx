import { requireLearner } from "@/server/access";

// Every page in the (signed-in) folder goes through this check first: signed
// out leads to the sign-in page, a non-allowed account to "not open yet".
// The folder name in brackets does not appear in addresses.
export default async function SignedInLayout({ children }: LayoutProps<"/">) {
  await requireLearner();
  return <>{children}</>;
}
