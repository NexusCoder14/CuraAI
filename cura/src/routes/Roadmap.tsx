import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Calendar, Home, ShoppingBag, MessageCircle, Scissors, CheckCircle2 } from "lucide-react";
import { useCura, type Roadmap as RoadmapT } from "@/lib/store/useCura";

const QUICK = [
  { label: "Wedding in 45 days", goal: "Look radiant for my wedding", days: 45 },
  { label: "Glow-up in 30 days", goal: "Transform my skin and hair", days: 30 },
  { label: "New job in 14 days", goal: "Polished corporate look for new role", days: 14 },
  { label: "Vacation in 21 days", goal: "Beach-ready, low-maintenance glow", days: 21 },
];

const ICON: Record<string, React.ComponentType<{className?: string}>> = { salon: Scissors, home: Home, product: ShoppingBag, consult: MessageCircle };

export default function Roadmap() {
  const twin = useCura((s) => s.twin);
  const profile = useCura((s) => s.profile);
  const roadmap = useCura((s) => s.roadmap);
  const setRoadmap = useCura((s) => s.setRoadmap);
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  async function generate(g: string, d: number) {
    setGoal(g); setDays(d); setLoading(true);
    try {
      const res = await fetch("/api/roadmap", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: g, days: d, profile: twin ?? profile ?? {} }) });
      setRoadmap((await res.json()) as RoadmapT);
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-24">
      <div className="text-center mb-8">
        <div className="chip mx-auto mb-3"><Sparkles className="w-3 h-3" /> AI Roadmap Planner</div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Tell us your <span className="text-grad">goal.</span></h1>
        <p className="text-muted mt-3 max-w-xl mx-auto">CURA designs a week-by-week beauty arc — salon visits, home rituals, products, milestones.</p>
      </div>

      <div className="glass-strong rounded-2xl p-4 md:p-5 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-4 h-4 text-violet flex-shrink-0" />
          <input value={goal} onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Look amazing for my wedding"
            className="flex-1 min-w-[200px] bg-transparent outline-none text-sm placeholder:text-muted text-ink px-2" />
          <div className="flex items-center gap-1 text-xs text-muted">
            <Calendar className="w-3.5 h-3.5" />
            <input type="number" min={7} max={84} value={days}
              onChange={(e) => setDays(Math.max(7, Math.min(84, Number(e.target.value))))}
              className="w-14 bg-transparent outline-none text-ink text-center border border-white/10 rounded-md py-1" />
            <span>days</span>
          </div>
          <button onClick={() => generate(goal || "Glow up", days)} disabled={loading} className="btn-primary !py-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK.map((q) => <button key={q.label} onClick={() => generate(q.goal, q.days)} className="chip hover:scale-105 transition">{q.label}</button>)}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 chip"><Loader2 className="w-3 h-3 animate-spin" /> CURA is architecting your plan…</div>
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 h-44 relative overflow-hidden"><div className="shimmer absolute inset-0" /></div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {roadmap && !loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
          <div className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden mb-5">
            <div className="absolute -top-20 right-20 w-80 h-80 rounded-full bg-violet/30 blur-3xl" />
            <div className="absolute -bottom-20 left-20 w-80 h-80 rounded-full bg-cyan/20 blur-3xl" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="chip mb-3">Plan generated</div>
                <h2 className="font-display text-3xl md:text-4xl text-grad">{roadmap.title}</h2>
                <p className="text-muted mt-2 max-w-2xl">{roadmap.summary}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">Estimated budget</div>
                <div className="font-display text-2xl text-ink">
                  ₹{roadmap.estimated_budget_inr.min.toLocaleString()}–{roadmap.estimated_budget_inr.max.toLocaleString()}
                </div>
                <div className="text-xs text-muted mt-1">{roadmap.total_weeks} weeks · {roadmap.weeks.reduce((a, w) => a + w.tasks.length, 0)} tasks</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-violet/60 via-aurora/40 to-plasma/60 hidden md:block" />
            <div className="space-y-4">
              {roadmap.weeks.map((w, i) => (
                <motion.div key={w.week} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="md:pl-16 relative">
                  <div className="hidden md:flex absolute left-0 top-4 w-12 h-12 rounded-full glass-strong items-center justify-center ring-glow">
                    <span className="font-display text-lg text-grad">{w.week}</span>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div>
                        <div className="text-xs text-muted">Week {w.week} · {w.phase}</div>
                        <h3 className="font-display text-xl">{w.focus}</h3>
                      </div>
                      <span className="chip"><CheckCircle2 className="w-3 h-3" /> {w.milestone}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {w.tasks.map((t, j) => {
                        const Icon = ICON[t.type] ?? Scissors;
                        return (
                          <div key={j} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet/30 to-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Icon className="w-4 h-4 text-ink" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-ink font-medium">{t.title}</div>
                              <div className="text-[11px] text-muted mt-0.5 flex items-center gap-2">
                                <span className="capitalize">{t.type}</span><span>·</span>
                                <span>{t.duration_min} min</span><span>·</span>
                                <span className={t.priority === "high" ? "text-plasma" : t.priority === "medium" ? "text-cyan" : "text-muted"}>{t.priority}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {roadmap.pro_tips?.length > 0 && (
            <div className="glass rounded-2xl p-6 mt-5">
              <div className="chip mb-3">Pro tips from CURA</div>
              <ul className="space-y-2 text-sm">
                {roadmap.pro_tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet flex-shrink-0 mt-1" />
                    <span className="text-ink/90">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {!roadmap && !loading && (
        <div className="text-center text-muted text-sm mt-12">Enter a goal above to generate your first roadmap.</div>
      )}
    </div>
  );
}
