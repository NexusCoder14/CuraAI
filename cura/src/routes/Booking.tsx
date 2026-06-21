import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Star, Clock, CheckCircle2, Sparkles, Calendar as CalIcon, Lock } from "lucide-react";
import { SALONS, getSalon } from "@/lib/data/salons";
import { useCura } from "@/lib/store/useCura";

const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

function todayISO() {
  const d = new Date();
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDaysISO(base: string, n: number) {
  const d = new Date(base + "T00:00:00");
  d.setDate(d.getDate() + n);
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function prettyDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
const currentTimeHM = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const slotMinutes = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

export default function Booking() {
  const { id = "" } = useParams();
  const salon = getSalon(id) ?? SALONS[0];
  const { addBooking, isSlotTaken, bookings } = useCura();

  const [serviceIdx, setServiceIdx] = useState(0);
  const today = useMemo(() => todayISO(), []);
  const maxDate = useMemo(() => addDaysISO(today, 90), [today]);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState<null | { date: string; time: string; service: string }>(null);
  const [error, setError] = useState("");

  const service = salon.services[serviceIdx];
  useEffect(() => { setTime(""); setError(""); }, [date, serviceIdx]);

  const quickDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDaysISO(today, i)), [today]);

  const slotStatuses = useMemo(() => {
    const isToday = date === today;
    const nowM = currentTimeHM();
    return SLOTS.map((s) => {
      const taken = isSlotTaken(salon.id, date, s);
      const past = isToday && slotMinutes(s) <= nowM + 15;
      return { time: s, taken, past, disabled: taken || past };
    });
  }, [date, today, salon.id, isSlotTaken, bookings]);

  function confirm() {
    if (!date) return setError("Please pick a date.");
    if (date < today) return setError("Date can't be in the past.");
    if (date > maxDate) return setError("Bookings open up to 90 days in advance.");
    if (!time) return setError("Please pick a time slot.");
    if (isSlotTaken(salon.id, date, time)) return setError("That slot was just taken. Pick another.");
    addBooking({
      salonId: salon.id, salonName: salon.name, serviceName: service.name,
      price: service.price, duration: service.duration, date, time,
    });
    setConfirmed({ date, time, service: service.name });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-24">
      <Link to="/book" className="text-xs text-muted inline-flex items-center gap-1 mb-5 hover:text-ink transition">
        <ArrowLeft className="w-3 h-3" /> Back to all salons
      </Link>

      <AnimatePresence mode="wait">
        {confirmed ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="glass-strong rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-violet/30 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 w-[24rem] h-[24rem] rounded-full bg-cyan/20 blur-3xl" />
            <div className="relative">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center mb-6 animate-pulse_glow">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="font-display text-4xl tracking-tight">Booking confirmed.</h1>
              <p className="text-muted mt-3 text-sm md:text-base">
                <span className="text-ink">{confirmed.service}</span> at <span className="text-ink">{salon.name}</span><br />
                <span className="text-ink">{prettyDate(confirmed.date)}</span> at <span className="text-ink">{confirmed.time}</span>
              </p>
              <div className="inline-flex items-center gap-1.5 chip mt-5"><Lock className="w-3 h-3" /> Slot locked</div>
              <p className="text-[11px] text-muted mt-3 max-w-md mx-auto">A reminder will arrive 24h before. CURA has refreshed your roadmap.</p>
              <div className="mt-6 flex justify-center gap-2 flex-wrap">
                <button onClick={() => { setConfirmed(null); setTime(""); }} className="btn-ghost text-xs">Book another slot</button>
                <Link to="/roadmap" className="btn-ghost text-xs">Updated roadmap</Link>
                <Link to="/chat" className="btn-primary text-xs">Prep with CURA</Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-[1.3fr_1fr] gap-5">
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-24 right-10 w-72 h-72 rounded-full blur-3xl opacity-60"
                style={{ background: `radial-gradient(closest-side, ${salon.accent}66, transparent 70%)` }} />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl glass-strong flex items-center justify-center text-3xl">{salon.image}</div>
                  <div>
                    <h1 className="font-display text-2xl tracking-tight">{salon.name}</h1>
                    <div className="text-xs text-muted flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {salon.address}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {salon.rating} ({salon.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-muted mb-2">Pick a service</div>
                  <div className="space-y-2">
                    {salon.services.map((s, i) => (
                      <button key={s.name} onClick={() => setServiceIdx(i)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition text-left ${
                          serviceIdx === i ? "bg-gradient-to-r from-violet/20 to-cyan/10 border-violet/40 ring-1 ring-violet/30"
                                          : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"}`}>
                        <div>
                          <div className="text-sm text-ink">{s.name}</div>
                          <div className="text-[11px] text-muted flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {s.duration} min</div>
                        </div>
                        <div className="text-sm font-mono text-grad-violet">₹{s.price.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="chip"><CalIcon className="w-3 h-3" /> Schedule</div>
                <span className="text-[10px] text-muted">Today → +90 days</span>
              </div>

              <div className="text-xs text-muted">Quick pick</div>
              <div className="mt-2 flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1">
                {quickDays.map((d) => {
                  const dObj = new Date(d + "T00:00:00");
                  const wk = dObj.toLocaleDateString("en-IN", { weekday: "short" });
                  const day = dObj.getDate();
                  const active = d === date;
                  const isToday = d === today;
                  return (
                    <button key={d} onClick={() => setDate(d)}
                      className={`flex-shrink-0 w-12 py-2 rounded-xl border text-center transition ${
                        active ? "bg-gradient-to-br from-violet/30 to-cyan/20 border-violet/60 text-ink"
                              : "bg-white/[0.03] border-white/10 text-muted hover:text-ink hover:border-white/20"}`}>
                      <div className="text-[9px] uppercase tracking-wider">{wk}</div>
                      <div className="font-display text-base leading-tight">{day}</div>
                      {isToday && <div className="text-[8px] text-cyan mt-0.5">today</div>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="text-xs text-muted">Or pick a date</label>
                <input type="date" value={date} min={today} max={maxDate} onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-ink outline-none focus:border-violet/60 transition [color-scheme:dark]" />
                <div className="text-[10px] text-muted mt-1">{prettyDate(date)}</div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-xs text-muted">Time</div>
                <div className="text-[10px] text-muted">{slotStatuses.filter(s => !s.disabled).length} of {SLOTS.length} available</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {slotStatuses.map((s) => {
                  const selected = time === s.time;
                  return (
                    <button key={s.time} onClick={() => !s.disabled && setTime(s.time)} disabled={s.disabled}
                      title={s.taken ? "Slot already booked" : s.past ? "Past time" : "Available"}
                      className={`relative py-2.5 rounded-lg text-xs border transition ${
                        s.disabled ? "bg-white/[0.02] border-white/5 text-muted/50 cursor-not-allowed line-through"
                                   : selected ? "bg-gradient-to-r from-violet/30 to-cyan/20 border-violet/60 text-ink shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_0_18px_-6px_rgba(139,92,246,0.7)]"
                                              : "bg-white/[0.03] border-white/10 text-ink hover:border-white/30 hover:bg-white/[0.06]"}`}>
                      {s.taken && <Lock className="w-2.5 h-2.5 absolute top-1.5 right-1.5 text-plasma/70" />}
                      {s.time}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <Row k="Service" v={service.name} />
                <Row k="Duration" v={`${service.duration} min`} />
                <Row k="When" v={time ? `${prettyDate(date)} · ${time}` : "—"} />
                <div className="flex justify-between text-sm pt-2 border-t border-white/5 mt-2">
                  <span className="text-muted">Total</span>
                  <span className="text-grad font-display text-lg">₹{service.price.toLocaleString()}</span>
                </div>
              </div>

              {error && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-[11px] text-plasma">{error}</motion.div>}

              <button disabled={!date || !time} onClick={confirm}
                className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                <Sparkles className="w-4 h-4" /> Confirm booking
              </button>
              <p className="text-[10px] text-muted text-center mt-2">No payment captured · demo flow</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {bookings.length > 0 && !confirmed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-5 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="chip">Your upcoming bookings</div>
            <div className="text-[10px] text-muted">{bookings.length} total</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {bookings.slice(-4).reverse().map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                <div className="text-ink font-medium truncate">{b.serviceName}</div>
                <div className="text-muted mt-0.5">{b.salonName} · {prettyDate(b.date)} · {b.time}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted">{k}</span><span className="text-ink text-right">{v}</span></div>;
}
