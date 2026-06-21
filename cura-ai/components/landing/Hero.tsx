"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Sphere } from "./Sphere";

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="chip mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            Powered by Groq · Sub-second inference
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight"
          >
            Meet your <span className="text-grad">AI Beauty</span><br />
            Agent.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-muted max-w-xl leading-relaxed"
          >
            Personalized beauty planning, salon discovery, and style transformation —
            orchestrated by a real-time AI that understands you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/twin/onboarding" className="btn-primary group">
              <Sparkles className="w-4 h-4" />
              Create Beauty Twin
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/chat" className="btn-ghost">
              <MessageCircle className="w-4 h-4" />
              Talk to AI
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-10 flex items-center gap-6 text-xs text-muted"
          >
            <div className="flex -space-x-2">
              {["#8b5cf6", "#22d3ee", "#e879f9", "#60a5fa"].map((c) => (
                <div key={c} className="w-7 h-7 rounded-full ring-2 ring-bg" style={{ background: c }} />
              ))}
            </div>
            <span>Trusted by <span className="text-ink font-medium">12,400+</span> Mumbai beauty seekers</span>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center">
          <Sphere />
          {/* Floating spec chips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-2 md:left-2 top-10 glass rounded-2xl px-3 py-2 text-xs flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
            Persona: <span className="text-grad-violet font-semibold">Bandra Bohemian</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute right-0 md:right-4 bottom-16 glass rounded-2xl px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              Beauty Score
            </div>
            <div className="text-2xl font-display text-grad mt-0.5">86<span className="text-xs text-muted">/100</span></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-2xl px-3 py-2 text-[11px] text-muted flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-plasma animate-pulse" />
            Next: <span className="text-ink">Brow lamination · Sat 4pm</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
