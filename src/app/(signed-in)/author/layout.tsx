import { requireAdmin } from "@/server/access";

// Everything under /author is admin only: anyone else is sent to /courses.
// (Its actions check again themselves; this layout does not protect them.)
export default async function AuthorLayout({ children }: LayoutProps<"/author">) {
  await requireAdmin({ calledFrom: "page" });
  return children;
}
