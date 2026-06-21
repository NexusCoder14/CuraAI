"use client";
import { motion } from "framer-motion";
import { Bot, Fingerprint, CalendarRange, Sparkles, Wand2, LineChart } from "lucide-react";
import Link from "next/link";
import { Reveal } from "../shared/Reveal";

const features = [
  {
    href: "/chat",
    icon: Bot,
    title: "AI Beauty Agent",
    desc: "A conversational concierge that knows skin, hair, salons, and timelines. Streamed by Groq.",
    accent: "from-violet/40 to-cyan/30",
    chip: "Conversational",
  },
  {
    href: "/twin",
    icon: Fingerprint,
    title: "Beauty Twin",
    desc: "A living style persona generated from your goals, hair, skin and budget. Updates as you do.",
    accent: "from-plasma/40 to-violet/30",
    chip: "Flagship",
  },
  {
    href: "/roadmap",
    icon: CalendarRange,
    title: "Beauty Roadmap",
    desc: "Tell us your goal and timeline. Get a week-by-week plan with salon visits, rituals and milestones.",
    accent: "from-aurora/40 to-cyan/30",
    chip: "Plan",
  },
  {
    href: "/salons",
    icon: Sparkles,
    title: "Salon Matchmaker",
    desc: "Not search. AI-ranked salons with style, budget, and goal compatibility scores.",
    accent: "from-cyan/40 to-aurora/30",
    chip: "Discover",
  },
  {
    href: "/look",
    icon: Wand2,
    title: "Look Explorer",
    desc: "Describe the look you want. Get a full blueprint — hair, skin, makeup, services, budget.",
    accent: "from-plasma/40 to-aurora/30",
    chip: "Generative",
  },
  {
    href: "/insights",
    icon: LineChart,
    title: "Beauty Insights",
    desc: "A personalized dashboard with your beauty score, strengths, and weekly recommendations.",
    accent: "from-violet/40 to-plasma/30",
    chip: "Analytics",
  },
];

export function Features() {
  return (
    <section className="relative px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="chip mb-4 mx-auto">Six AI Modules. One OS.</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">
              An operating system <span className="text-grad">for your beauty.</span>
            </h2>
            <p className="text-muted mt-4">
              CURA isn't a directory of salons — it's an intelligent layer that
              orchestrates every part of your beauty journey.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <Link href={f.href} className="group block h-full">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="glass rounded-2xl p-6 h-full relative overflow-hidden"
                >
                  <div
                    className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${f.accent} blur-3xl opacity-60 group-hover:opacity-90 transition`}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                        <f.icon className="w-4.5 h-4.5 text-ink" />
                      </div>
                      <span className="chip">{f.chip}</span>
                    </div>
                    <h3 className="font-display text-xl text-ink">{f.title}</h3>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{f.desc}</p>
                    <div className="mt-6 text-xs text-grad-violet flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      Open module →
                    </div>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
