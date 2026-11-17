import type { Metadata } from "next";
import { Archivo_Black, Atkinson_Hyperlegible, Silkscreen } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashbang",
  description: "Daily review for lecture courses.",
};

// next/font downloads each face at build time and exposes it as a CSS variable.
// The theme file (themes/starting.css) points the font tokens at these variables.
const displayFont = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--loaded-font-archivo-black" });
const bodyFont = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--loaded-font-atkinson-hyperlegible",
});
const numberFont = Silkscreen({ weight: "400", subsets: ["latin"], variable: "--loaded-font-silkscreen" });

const fontVariableClasses = `${displayFont.variable} ${bodyFont.variable} ${numberFont.variable}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme picks the block of token values in src/app/themes/.
    <html lang="en" data-theme="starting" className={fontVariableClasses}>
      <body className="min-h-screen bg-page font-body text-ink">{children}</body>
    </html>
  );
}
