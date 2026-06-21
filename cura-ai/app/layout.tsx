import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/shared/Nav";
import { Aurora } from "@/components/shared/Aurora";

export const metadata: Metadata = {
  title: "CURA AI — The AI Beauty Operating System",
  description:
    "Personalized beauty planning, salon discovery, and style transformation powered by AI. Meet your AI Beauty Agent.",
  openGraph: {
    title: "CURA AI",
    description: "The AI Beauty Operating System.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-bg text-ink antialiased font-sans relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <Aurora />
        <Nav />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
