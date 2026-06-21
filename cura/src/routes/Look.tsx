import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Wand2 } from "lucide-react";

type Blueprint = {
  look_name: string; aesthetic_summary: string; mood_keywords: string[]; color_palette: string[];
  hair: { style: string; color: string; treatments: string[] };
  skin: { finish: string; routine: string[] };
  makeup: { eyes: string; lips: string; complexion: string };
  recommended_services: string[]; celebrity_references: string[];
  estimated_sessions: number; estimated_budget_inr: { min: number; max: number };
};

const PROMPTS = [
  "Elegant Bollywood actress on a magazine cover",
  "Luxury minimalist CEO, modern Korean glow",
  "Modern Indian groom, sharp and clean",
  "Bridal radiance — soft glam, traditional touch",
  "Editorial avant-garde, Bandra art-night",
];

export default function Look() {
  const [desc, setDesc] = useState("");
  const [look, setLook] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate(d: string) {
    if (!d.trim()) return;
    setDesc(d); setLoading(true);
    try {
      const res = await fetch("/api/look", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description: d }) });
      setLook(await res.json());
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-24">
      <div className="text-center mb-7">
        <div className="chip mx-auto mb-3"><Wand2 className="w-3 h-3" /> AI Look Explorer</div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Describe a look. <span className="text-grad">Get the blueprint.</span></h1>
        <p className="text-muted mt-3 max-w-xl mx-auto">CURA generates a full aesthetic — hair, skin, makeup, services, and budget — from a single sentence.</p>
      </div>

      <div className="glass-strong rounded-2xl p-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-violet" />
          <input value={desc} onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") generate(desc); }}
            placeholder="e.g. Minimal Korean glow, soft sun-kissed, effortless"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted text-ink px-2" />
          <button onClick={() => generate(desc)} disabled={loading || !desc.trim()} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-50">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Generate
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {PROMPTS.map((p) => <button key={p} onClick={() => generate(p)} className="chip hover:scale-105 transition">{p}</button>)}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
            <div className="grid md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 h-44 relative overflow-hidden"><div className="shimmer absolute inset-0" /></div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {look && !loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="glass-strong rounded-3xl p-8 relative overflow-hidden mb-5">
            <div className="absolute -top-32 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-60"
              style={{ background: `radial-gradient(closest-side, ${look.color_palette[0] ?? "#8b5cf6"}, transparent 70%)` }} />
            <div className="absolute -bottom-32 left-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50"
              style={{ background: `radial-gradient(closest-side, ${look.color_palette[2] ?? "#22d3ee"}, transparent 70%)` }} />
            <div className="relative">
              <div className="chip mb-3">Look blueprint</div>
              <h2 className="font-display text-4xl md:text-6xl text-grad">{look.look_name}</h2>
              <p className="text-muted mt-3 max-w-2xl">{look.aesthetic_summary}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {look.mood_keywords.map((k) => <span key={k} className="chip">{k}</span>)}
              </div>
              <div className="flex gap-2 mt-5">
                {look.color_palette.map((c) => (
                  <div key={c} className="w-12 h-12 rounded-xl ring-1 ring-white/10 relative overflow-hidden" style={{ background: c }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <Card title="Hair">
              <Row k="Style" v={look.hair.style} /><Row k="Color" v={look.hair.color} />
              <Row k="Treatments" v={look.hair.treatments.join(", ")} />
            </Card>
            <Card title="Skin">
              <Row k="Finish" v={look.skin.finish} />
              <Row k="Routine" v={look.skin.routine.join(" → ")} />
            </Card>
            <Card title="Makeup">
              <Row k="Eyes" v={look.makeup.eyes} /><Row k="Lips" v={look.makeup.lips} />
              <Row k="Complexion" v={look.makeup.complexion} />
            </Card>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-5 mt-5">
            <div className="glass rounded-2xl p-6">
              <div className="chip mb-3">Recommended services</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {look.recommended_services.map((s) => (
                  <div key={s} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet" /> {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="chip mb-3">Plan summary</div>
              <Row k="Sessions" v={String(look.estimated_sessions)} />
              <Row k="Budget" v={`₹${look.estimated_budget_inr.min.toLocaleString()}–${look.estimated_budget_inr.max.toLocaleString()}`} />
              <Row k="References" v={look.celebrity_references.join(" · ")} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="glass rounded-2xl p-6"><div className="chip mb-3">{title}</div><div className="space-y-2.5">{children}</div></div>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div><div className="text-[10px] uppercase tracking-wider text-muted">{k}</div><div className="text-sm text-ink mt-0.5">{v}</div></div>;
}
