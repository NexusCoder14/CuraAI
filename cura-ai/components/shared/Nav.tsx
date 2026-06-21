"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/chat", label: "AI Agent" },
  { href: "/twin", label: "Beauty Twin" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/salons", label: "Matchmaker" },
  { href: "/look", label: "Look Explorer" },
  { href: "/insights", label: "Insights" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50">
      <div className="flex justify-center pt-4 px-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-2xl px-3 py-2 flex items-center gap-2 max-w-5xl w-full"
        >
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-xl group">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-aurora to-cyan animate-pulse_glow" />
              <div className="absolute inset-[3px] rounded-full bg-bg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-violet" />
              </div>
            </div>
            <span className="font-display font-semibold tracking-tight text-ink">CURA</span>
            <span className="text-[10px] text-muted hidden sm:inline ml-1 px-1.5 py-0.5 rounded-md border border-white/10">AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-2 flex-1">
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link key={l.href} href={l.href} className="relative px-3 py-1.5 text-xs text-muted hover:text-ink transition rounded-lg">
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-white/5 border border-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    />
                  )}
                  <span className={cn("relative", active && "text-ink")}>{l.label}</span>
                </Link>
              );
            })}
          </div>
          <Link href="/twin/onboarding" className="btn-primary !py-2 !px-3 text-xs ml-auto">
            <Sparkles className="w-3.5 h-3.5" /> Create Twin
          </Link>
        </motion.nav>
      </div>
    </header>
  );
}
