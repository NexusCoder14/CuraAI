"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Star, Loader2, Filter, ArrowRight } from "lucide-react";
import { useCura } from "@/lib/store/useCura";
import type { Salon } from "@/lib/data/salons";

type Match = {
  salon_id: string;
  compatibility: number;
  style_match: number;
  budget_match: number;
  goal_match: number;
  reasoning: string;
  signature_service: string;
  salon: Salon;
};

const AREAS = ["All", "Bandra", "Juhu", "Powai", "BKC", "Worli", "Andheri", "Lower Parel", "Khar"];
const BANDS = ["All", "₹", "₹₹", "₹₹₹", "₹₹₹₹"];

export function Matchmaker() {
  const twin = useCura((s) => s.twin);
  const [location, setLocation] = useState("All");
  const [priceBand, setPriceBand] = useState("All");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchMatches() {
    setLoading(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twin: twin ?? {}, filters: { location, priceBand } }),
      });
      const data = await res.json();
      setMatches(data.matches ?? []);
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchMatches(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
      <div className="text-center mb-8">
        <div className="chip mx-auto mb-3"><Sparkles className="w-3 h-3" /> AI Salon Matchmaker</div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">
          Not search — <span className="text-grad">matched.</span>
        </h1>
        <p className="text-muted mt-3 max-w-xl mx-auto">
          CURA ranks Mumbai's salons by how well they fit your BeautyTwin, budget, and goals.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-strong rounded-2xl p-3 max-w-3xl mx-auto flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-muted mr-2"><Filter className="w-3.5 h-3.5" /> Filters</div>
        <Select label="Area" value={location} onChange={setLocation} options={AREAS} />
        <Select label="Price" value={priceBand} onChange={setPriceBand} options={BANDS} />
        <div className="flex-1" />
        <button onClick={fetchMatches} disabled={loading} className="btn-primary !py-2 !px-3 text-xs">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Re-rank with AI
        </button>
      </div>

      {/* Grid */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {loading && matches.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 h-72 relative overflow-hidden">
                  <div className="shimmer absolute inset-0" />
                </div>
              ))
            : matches.map((m, i) => <MatchCard key={m.salon_id} match={m} index={i} />)
          }
        </AnimatePresence>
      </div>

      {!loading && matches.length === 0 && (
        <div className="text-center text-muted mt-16">No matches yet. Try widening your filters.</div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs">
      <span className="text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-ink outline-none cursor-pointer">
        {options.map((o) => <option key={o} value={o} className="bg-surface">{o}</option>)}
      </select>
    </label>
  );
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  const s = match.salon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition"
        style={{ background: `radial-gradient(closest-side, ${s.accent}55, transparent 70%)` }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl glass-strong flex items-center justify-center text-2xl">{s.image}</div>
            <div>
              <h3 className="font-display text-lg leading-tight">{s.name}</h3>
              <div className="text-xs text-muted flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {s.area} · {s.priceBand}</div>
            </div>
          </div>
          <CompatBadge score={match.compatibility} />
        </div>

        <p className="text-xs text-muted leading-relaxed mt-2 italic">"{match.reasoning}"</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
          <Bar label="Style" v={match.style_match} />
          <Bar label="Budget" v={match.budget_match} />
          <Bar label="Goal" v={match.goal_match} />
        </div>

        <div className="mt-4 p-2.5 rounded-xl bg-gradient-to-r from-violet/15 to-cyan/10 border border-white/10">
          <div className="text-[10px] text-muted uppercase tracking-wider">Signature for you</div>
          <div className="text-sm text-ink font-medium">{match.signature_service}</div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-ink">{s.rating}</span>
            <span>({s.reviews})</span>
          </div>
          <Link href={`/booking/${s.id}`} className="text-xs text-grad-violet inline-flex items-center gap-1 hover:gap-2 transition-all">
            Book <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function CompatBadge({ score }: { score: number }) {
  const color = score >= 90 ? "from-cyan to-violet" : score >= 75 ? "from-violet to-plasma" : "from-aurora to-violet";
  return (
    <div className={`rounded-xl px-2.5 py-1.5 bg-gradient-to-br ${color} text-[10px] leading-none text-white text-center`}>
      <div className="font-display text-base leading-none">{score}</div>
      <div className="opacity-80 mt-0.5">match</div>
    </div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-muted mb-1">
        <span>{label}</span><span>{v}</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8 }}
          className="h-full bg-gradient-to-r from-violet to-cyan" />
      </div>
    </div>
  );
}
