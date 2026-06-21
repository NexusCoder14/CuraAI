import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, Bot, Fingerprint, CalendarRange, Wand2, LineChart, CalendarPlus } from "lucide-react";
import { Constellation } from "@/components/landing/Constellation";
import { Reveal } from "@/components/shared/Reveal";

const FEATURES = [
  { to: "/chat", icon: Bot, title: "AI Beauty Agent", desc: "A conversational concierge that knows skin, hair, salons, and timelines.", chip: "Conversational", accent: "from-violet/40 to-cyan/30" },
  { to: "/twin", icon: Fingerprint, title: "Beauty Twin", desc: "A living style persona generated from your goals, hair, skin and budget.", chip: "Flagship", accent: "from-plasma/40 to-violet/30" },
  { to: "/roadmap", icon: CalendarRange, title: "Beauty Roadmap", desc: "Tell us your goal. Get a week-by-week plan with salon visits, rituals, milestones.", chip: "Plan", accent: "from-aurora/40 to-cyan/30" },
  { to: "/book", icon: CalendarPlus, title: "Direct Booking", desc: "Browse Mumbai's best salons, see pricing, book a slot in three taps.", chip: "Book", accent: "from-cyan/40 to-aurora/30" },
  { to: "/look", icon: Wand2, title: "Look Explorer", desc: "Describe a look. Get a full blueprint — hair, skin, makeup, services, budget.", chip: "Generative", accent: "from-plasma/40 to-aurora/30" },
  { to: "/insights", icon: LineChart, title: "Beauty Insights", desc: "Personalized dashboard with beauty score, strengths, and weekly recs.", chip: "Analytics", accent: "from-violet/40 to-plasma/30" },
];

const STATS = [
  { k: "<300ms", v: "AI response time" },
  { k: "120+", v: "Salons mapped in Mumbai" },
  { k: "5", v: "AI modules, one OS" },
  { k: "94%", v: "Match accuracy" },
];

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 md:pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="chip mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" /> Powered by Groq · Sub-second inference
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Meet your <span className="text-grad">AI Beauty</span><br />Agent.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-lg md:text-xl text-muted max-w-xl leading-relaxed">
              Personalized beauty planning, salon discovery, and style transformation — orchestrated by a real-time AI that understands you.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3">
              <Link to="/twin/onboarding" className="btn-primary group">
                <Sparkles className="w-4 h-4" /> Create Beauty Twin
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link to="/book" className="btn-ghost"><CalendarPlus className="w-4 h-4" /> Book a salon</Link>
              <Link to="/chat" className="btn-ghost"><MessageCircle className="w-4 h-4" /> Talk to AI</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 flex items-center gap-6 text-xs text-muted">
              <div className="flex -space-x-2">
                {["#8b5cf6", "#22d3ee", "#e879f9", "#60a5fa"].map((c) => (
                  <div key={c} className="w-7 h-7 rounded-full ring-2 ring-bg" style={{ background: c }} />
                ))}
              </div>
              <span>Trusted by <span className="text-ink font-medium">12,400+</span> Mumbai beauty seekers</span>
            </motion.div>
          </div>
          <div className="relative flex items-center justify-center">
            <Constellation />
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="absolute -left-2 md:left-2 top-10 glass rounded-2xl px-3 py-2 text-xs flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" />
              Persona: <span className="text-grad-violet font-semibold">Bandra Bohemian</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="absolute right-0 md:right-4 bottom-16 glass rounded-2xl px-3 py-2 text-xs">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" /> Beauty Score</div>
              <div className="text-2xl font-display text-grad mt-0.5">86<span className="text-xs text-muted">/100</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-2xl px-3 py-2 text-[11px] text-muted flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-plasma animate-pulse" />
              Next: <span className="text-ink">Brow lamination · Sat 4pm</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-6 py-6">
        <div className="max-w-6xl mx-auto glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.v} delay={i * 0.05}>
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl text-grad">{s.k}</div>
                <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="chip mb-4 mx-auto">Six AI Modules. One OS.</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight">
                An operating system <span className="text-grad">for your beauty.</span>
              </h2>
              <p className="text-muted mt-4">CURA isn't a directory of salons — it's an intelligent layer that orchestrates every part of your beauty journey.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <Link to={f.to} className="group block h-full">
                  <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="glass rounded-2xl p-6 h-full relative overflow-hidden">
                    <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${f.accent} blur-3xl opacity-60 group-hover:opacity-90 transition`} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                          <f.icon className="w-4 h-4 text-ink" />
                        </div>
                        <span className="chip">{f.chip}</span>
                      </div>
                      <h3 className="font-display text-xl text-ink">{f.title}</h3>
                      <p className="text-sm text-muted mt-2 leading-relaxed">{f.desc}</p>
                      <div className="mt-6 text-xs text-grad-violet flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">Open module →</div>
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-20">
        <Reveal>
          <div className="max-w-5xl mx-auto glass-strong rounded-3xl p-12 relative overflow-hidden text-center">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-violet/40 via-aurora/30 to-plasma/40 blur-3xl opacity-60" />
            <div className="relative">
              <div className="chip mx-auto mb-5">Ready when you are</div>
              <h2 className="font-display text-4xl md:text-6xl tracking-tight">
                Your beauty, <span className="text-grad">intelligently planned.</span>
              </h2>
              <p className="text-muted mt-4 max-w-xl mx-auto">Spin up your Beauty Twin in under a minute. No credit card. Cancel reality anytime.</p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link to="/twin/onboarding" className="btn-primary"><Sparkles className="w-4 h-4" /> Create Beauty Twin <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/chat" className="btn-ghost">Talk to AI</Link>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="mt-12 text-center text-xs text-muted">© 2026 CURA AI · Mumbai, India · Built for the Beauty OS Hackathon</div>
      </section>
    </>
  );
}
