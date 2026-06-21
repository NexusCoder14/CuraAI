import { Link } from "react-router-dom";
import { useCura } from "@/lib/store/useCura";
import { Trash2, Sparkles } from "lucide-react";

export default function Profile() {
  const { profile, twin, roadmap, bookings, reset } = useCura();
  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-24">
      <div className="mb-6">
        <div className="chip mb-3">Profile</div>
        <h1 className="font-display text-4xl tracking-tight">Account & data</h1>
        <p className="text-muted mt-2 text-sm">Your CURA data is stored locally on this device. Reset anytime.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet to-cyan animate-pulse_glow flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-display text-xl">{twin?.persona ?? "No Beauty Twin yet"}</div>
            <div className="text-xs text-muted">{twin?.tagline ?? "Complete onboarding to synthesize your twin."}</div>
          </div>
          <div className="ml-auto">
            <Link to={twin ? "/twin" : "/twin/onboarding"} className="btn-ghost text-xs">{twin ? "View Twin" : "Start"}</Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-4">
        <Stat label="Profile" v={profile ? "Set" : "Not set"} />
        <Stat label="Roadmap" v={roadmap?.title ?? "None"} />
        <Stat label="Beauty Score" v={twin ? `${twin.beauty_score}/100` : "—"} />
        <Stat label="Bookings" v={String(bookings.length)} />
      </div>

      <button onClick={() => { if (confirm("Reset all CURA data?")) reset(); }}
        className="btn-ghost mt-6 text-xs text-plasma hover:text-plasma">
        <Trash2 className="w-3.5 h-3.5" /> Reset all data
      </button>
    </div>
  );
}
function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className="text-ink mt-1 truncate">{v}</div>
    </div>
  );
}
