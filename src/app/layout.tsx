import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashbang",
  description: "Daily review for lecture courses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
