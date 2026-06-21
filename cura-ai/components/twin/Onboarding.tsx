"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Loader2, Check } from "lucide-react";
import { useCura } from "@/lib/store/useCura";
import type { TwinProfile } from "@/lib/ai/beautyTwin";

type Step = {
  key: keyof TwinProfile;
  title: string;
  subtitle: string;
  type: "single" | "multi";
  options: string[];
};

const STEPS: Step[] = [
  { key: "ageRange", title: "What's your age range?", subtitle: "Helps us tune recommendations.", type: "single", options: ["18–24", "25–32", "33–40", "41–50", "50+"] },
  { key: "goals", title: "What are your beauty goals?", subtitle: "Pick up to three.", type: "multi", options: ["Glow up", "Hair transformation", "Anti-aging", "Bridal prep", "Daily routine", "Confidence boost", "Event ready", "Hair health"] },
  { key: "styles", title: "Which styles speak to you?", subtitle: "Multi-select.", type: "multi", options: ["Minimal", "Glam", "Editorial", "Bohemian", "Corporate", "Trend-forward", "Classic", "Edgy"] },
  { key: "hairType", title: "Your hair type?", subtitle: "We'll factor texture into every plan.", type: "single", options: ["Straight", "Wavy", "Curly", "Coily", "Color-treated", "Fine", "Thick"] },
  { key: "skinType", title: "Your skin type?", subtitle: "Mumbai humidity matters.", type: "single", options: ["Oily", "Dry", "Combination", "Sensitive", "Normal", "Acne-prone"] },
  { key: "budget", title: "Comfortable monthly beauty budget?", subtitle: "Used by Matchmaker.", type: "single", options: ["Under ₹3K", "₹3–8K", "₹8–15K", "₹15–30K", "₹30K+"] },
  { key: "events", title: "Any upcoming moments?", subtitle: "Multi-select. We'll plan around them.", type: "multi", options: ["Wedding", "Engagement", "Photoshoot", "Festival", "Vacation", "Job interview", "Date night", "Nothing big"] },
];

export function Onboarding() {
  const router = useRouter();
  const setProfile = useCura((s) => s.setProfile);
  const setTwin = useCura((s) => s.setTwin);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);

  const current = STEPS[step];
  const value = values[current.key];

  function setVal(v: string) {
    setValues((prev) => {
      const cur = prev[current.key];
      if (current.type === "single") return { ...prev, [current.key]: v };
      const arr = Array.isArray(cur) ? cur : [];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v].slice(0, 4);
      return { ...prev, [current.key]: next };
    });
  }

  function isSelected(v: string) {
    const cur = values[current.key];
    return current.type === "single" ? cur === v : Array.isArray(cur) && cur.includes(v);
  }

  const canNext = current.type === "single" ? Boolean(value) : Array.isArray(value) && value.length > 0;

  async function finish() {
    setLoading(true);
    const profile: TwinProfile = {
      ageRange: String(values.ageRange ?? ""),
      goals: (values.goals as string[]) ?? [],
      styles: (values.styles as string[]) ?? [],
      hairType: String(values.hairType ?? ""),
      skinType: String(values.skinType ?? ""),
      budget: String(values.budget ?? ""),
      events: (values.events as string[]) ?? [],
      location: "Mumbai",
    };
    setProfile(profile);
    try {
      const res = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const twin = await res.json();
      setTwin(twin);
      router.push("/twin");
    } catch {
      router.push("/twin");
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-16 pb-24">
      {/* progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>Synthesizing your Beauty Twin</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet via-aurora to-cyan"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet via-aurora to-plasma animate-pulse_glow blur-xl" />
            <div className="absolute inset-2 rounded-full bg-bg flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-violet" />
            </div>
          </div>
          <h2 className="font-display text-2xl">Calibrating your Beauty Twin…</h2>
          <p className="text-muted text-sm mt-2">Groq is synthesizing your persona, palette, and style DNA.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-3xl p-8 md:p-10"
          >
            <div className="chip mb-4"><Sparkles className="w-3 h-3" /> CURA Onboarding</div>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight">{current.title}</h1>
            <p className="text-muted mt-2">{current.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {current.options.map((opt) => {
                const selected = isSelected(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => setVal(opt)}
                    className={`relative px-4 py-2.5 rounded-xl text-sm border transition ${
                      selected
                        ? "bg-gradient-to-br from-violet/30 to-aurora/20 border-violet/60 text-ink"
                        : "bg-white/[0.03] border-white/10 text-muted hover:text-ink hover:border-white/20"
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-10">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {step === STEPS.length - 1 ? (
                <button onClick={finish} disabled={!canNext} className="btn-primary disabled:opacity-50">
                  <Sparkles className="w-4 h-4" /> Generate Beauty Twin
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  disabled={!canNext}
                  className="btn-primary disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
