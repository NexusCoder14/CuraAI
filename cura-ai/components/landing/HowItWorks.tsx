"use client";
import { Reveal } from "../shared/Reveal";

const steps = [
  { n: "01", title: "Onboard in 60s", desc: "Tell CURA about your hair, skin, goals and budget. We synthesize a Beauty Twin." },
  { n: "02", title: "Talk, plan, explore", desc: "Chat with your AI Agent. Generate roadmaps. Explore looks. Match with Mumbai's best salons." },
  { n: "03", title: "Book & track", desc: "One-tap booking. Progress and insights update after every session." },
];

export function HowItWorks() {
  return (
    <section className="relative px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <div className="chip mb-4 mx-auto">How it works</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">
              From <span className="text-grad">onboarding</span> to glow-up, in three moves.
            </h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <div className="glass rounded-2xl p-6 relative h-full">
                <div className="font-display text-5xl text-grad-violet">{s.n}</div>
                <div className="mt-5 text-lg font-display">{s.title}</div>
                <p className="text-sm text-muted mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
