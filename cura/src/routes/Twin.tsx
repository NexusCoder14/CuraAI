import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, Wand2, CalendarRange } from "lucide-react";
import { useCura } from "@/lib/store/useCura";

export default function Twin() {
  const twin = useCura((s) => s.twin);
  const profile = useCura((s) => s.profile);

  if (!twin) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-24 text-center">
        <div className="glass rounded-3xl p-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet to-cyan animate-pulse_glow flex items-center justify-center mb-5">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl">Your Beauty Twin awaits.</h1>
          <p className="text-muted mt-2 max-w-md mx-auto">Answer 7 quick questions and CURA will synthesize your persona, style DNA, and beauty score.</p>
          <Link to="/twin/onboarding" className="btn-primary mt-6 inline-flex">Start Onboarding <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    );
  }

  const dnaEntries = Object.entries(twin.style_dna);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-24">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-strong rounded-3xl p-8 md:p-10 relative overflow-hidden mb-5">
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-60"
          style={{ background: `radial-gradient(closest-side, ${twin.color_palette[1] ?? "#8b5cf6"}, transparent 70%)` }} />
        <div className="absolute -bottom-32 -left-32 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-50"
          style={{ background: `radial-gradient(closest-side, ${twin.color_palette[2] ?? "#22d3ee"}, transparent 70%)` }} />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="chip mb-3"><Sparkles className="w-3 h-3" /> Your Beauty Twin</div>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight leading-none">
              <span className="text-grad">{twin.persona}</span>
            </h1>
            <p className="text-lg text-ink/90 mt-3 italic font-display">"{twin.tagline}"</p>
            <p className="text-muted mt-4 max-w-xl leading-relaxed">{twin.summary}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {twin.signature_traits.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
          <ScoreRing score={twin.beauty_score} />
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div><div className="text-xs text-muted">Module</div><h3 className="font-display text-xl">Style DNA</h3></div>
            <span className="chip">5 dimensions</span>
          </div>
          <div className="space-y-3.5">
            {dnaEntries.map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1.5"><span className="capitalize text-ink">{k}</span><span className="text-muted">{v}</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9, delay: 0.15 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet via-aurora to-cyan" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass rounded-2xl p-6">
          <div className="text-xs text-muted">Signature</div>
          <h3 className="font-display text-xl mb-4">Palette</h3>
          <div className="grid grid-cols-2 gap-2">
            {twin.color_palette.map((c) => (
              <div key={c} className="aspect-square rounded-xl relative overflow-hidden ring-1 ring-white/10" style={{ background: c }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute bottom-1 left-1.5 text-[9px] font-mono text-white/80">{c}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="text-xs text-muted mb-2">Recommended vibes</div>
            <div className="flex flex-wrap gap-1.5">
              {twin.recommended_vibes.map((v) => <span key={v} className="chip">{v}</span>)}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
        className="glass-strong rounded-2xl p-6 mt-5 relative overflow-hidden">
        <div className="absolute -top-20 right-10 w-60 h-60 rounded-full bg-violet/30 blur-3xl" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-xs text-muted">Next best action · generated for you</div>
            <h3 className="font-display text-2xl mt-1">{twin.next_best_action}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/roadmap" className="btn-ghost"><CalendarRange className="w-4 h-4" /> Build Roadmap</Link>
            <Link to="/book" className="btn-ghost"><Wand2 className="w-4 h-4" /> Book a Salon</Link>
            <Link to="/chat" className="btn-primary"><MessageCircle className="w-4 h-4" /> Talk to CURA</Link>
          </div>
        </div>
      </motion.div>

      {profile && (
        <div className="glass rounded-2xl p-6 mt-5">
          <div className="text-xs text-muted mb-3">Captured during onboarding</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Field k="Age" v={profile.ageRange} /><Field k="Hair" v={profile.hairType} />
            <Field k="Skin" v={profile.skinType} /><Field k="Budget" v={profile.budget} />
            <Field k="Goals" v={profile.goals.join(", ")} /><Field k="Styles" v={profile.styles.join(", ")} />
            <Field k="Events" v={profile.events.join(", ")} /><Field k="Location" v={profile.location ?? "Mumbai"} />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return <div><div className="text-[10px] uppercase tracking-wider text-muted">{k}</div><div className="text-ink mt-0.5">{v || "—"}</div></div>;
}

function ScoreRing({ score }: { score: number }) {
  const r = 56; const c = 2 * Math.PI * r; const offset = c - (score / 100) * c;
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" /><stop offset="50%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <motion.circle cx="70" cy="70" r={r} stroke="url(#g)" strokeWidth="10" strokeLinecap="round" fill="none"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-wider text-muted">Beauty Score</div>
        <div className="font-display text-5xl text-grad">{score}</div>
        <div className="text-[10px] text-muted">/ 100</div>
      </div>
    </div>
  );
}
