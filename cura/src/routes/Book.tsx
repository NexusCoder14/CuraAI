import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarPlus, MapPin, Star, Search, Filter, ArrowRight, Clock } from "lucide-react";
import { SALONS } from "@/lib/data/salons";
import { useCura } from "@/lib/store/useCura";

const AREAS = ["All", "Bandra", "Juhu", "Powai", "BKC", "Worli", "Andheri", "Lower Parel", "Khar"];
const BANDS = ["All", "₹", "₹₹", "₹₹₹", "₹₹₹₹"];

function prettyDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function Book() {
  const bookings = useCura((s) => s.bookings);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");
  const [band, setBand] = useState("All");
  const [sort, setSort] = useState<"top" | "price" | "rating">("top");

  const filtered = useMemo(() => {
    let list = SALONS.filter((s) => {
      if (area !== "All" && !s.area.toLowerCase().includes(area.toLowerCase())) return false;
      if (band !== "All" && s.priceBand !== band) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (![s.name, s.area, ...s.specialties, ...s.vibes].some((x) => x.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "price") list = [...list].sort((a, b) => a.priceBand.length - b.priceBand.length);
    return list;
  }, [query, area, band, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-24">
      <div className="text-center mb-7">
        <div className="chip mx-auto mb-3"><CalendarPlus className="w-3 h-3" /> Direct Booking</div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Book in <span className="text-grad">three taps.</span></h1>
        <p className="text-muted mt-3 max-w-xl mx-auto">Skip the chat. Pick a salon, pick a service, pick a slot.</p>
      </div>

      {/* Upcoming bookings strip */}
      {bookings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4 mb-6 relative overflow-hidden">
          <div className="absolute -top-10 right-20 w-40 h-40 rounded-full bg-violet/20 blur-3xl" />
          <div className="relative flex items-center justify-between gap-3 mb-3">
            <div className="text-xs text-muted uppercase tracking-wider">Your upcoming bookings · {bookings.length}</div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 relative">
            {bookings.slice(-4).reverse().map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xs text-ink font-medium truncate">{b.serviceName}</div>
                <div className="text-[11px] text-muted mt-0.5 truncate">{b.salonName}</div>
                <div className="text-[11px] text-grad-violet mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {prettyDate(b.date)} · {b.time}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search + filters */}
      <div className="glass-strong rounded-2xl p-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-2">
          <Search className="w-4 h-4 text-muted flex-shrink-0" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search salons, services, vibes…"
            className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-muted" />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted"><Filter className="w-3.5 h-3.5" /></div>
        <Select label="Area" value={area} onChange={setArea} options={AREAS} />
        <Select label="Price" value={band} onChange={setBand} options={BANDS} />
        <Select label="Sort" value={sort} onChange={(v) => setSort(v as any)} options={["top", "rating", "price"]} display={{ top: "Recommended", rating: "Top-rated", price: "Price ↑" }} />
        <span className="text-[10px] text-muted ml-1">{filtered.length} salons</span>
      </div>

      {/* Grid */}
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition"
              style={{ background: `radial-gradient(closest-side, ${s.accent}55, transparent 70%)` }} />
            <div className="relative">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl glass-strong flex items-center justify-center text-2xl flex-shrink-0">{s.image}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg leading-tight truncate">{s.name}</h3>
                  <div className="text-xs text-muted flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" /> {s.area} · {s.priceBand}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-ink font-medium">{s.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                {s.specialties.slice(0, 3).map((sp) => (
                  <span key={sp} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-muted">{sp}</span>
                ))}
              </div>

              {/* Service preview list */}
              <div className="space-y-1.5 mt-3 mb-4">
                {s.services.slice(0, 2).map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between text-xs">
                    <span className="text-ink/85 truncate pr-2">{svc.name}</span>
                    <span className="text-grad-violet font-mono text-[11px] flex-shrink-0">₹{svc.price.toLocaleString()}</span>
                  </div>
                ))}
                {s.services.length > 2 && (
                  <div className="text-[10px] text-muted">+{s.services.length - 2} more services</div>
                )}
              </div>

              <Link to={`/booking/${s.id}`}
                className="btn-primary w-full !py-2.5 text-xs justify-center group">
                <CalendarPlus className="w-4 h-4" /> Book a slot
                <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-muted mt-12">No salons match. Try widening your filters.</div>
      )}
    </div>
  );
}

function Select<T extends string>({
  label, value, onChange, options, display,
}: { label: string; value: T; onChange: (v: T) => void; options: readonly T[]; display?: Record<string, string> }) {
  return (
    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs">
      <span className="text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="bg-transparent text-ink outline-none cursor-pointer">
        {options.map((o) => <option key={o} value={o} className="bg-surface">{display?.[o] ?? o}</option>)}
      </select>
    </label>
  );
}
