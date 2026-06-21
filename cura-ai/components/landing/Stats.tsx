"use client";
import { Reveal } from "../shared/Reveal";

const stats = [
  { k: "<300ms", v: "AI response time" },
  { k: "120+", v: "Salons mapped in Mumbai" },
  { k: "6", v: "AI modules, one OS" },
  { k: "94%", v: "Match accuracy" },
];

export function Stats() {
  return (
    <section className="relative px-6 py-10">
      <div className="max-w-6xl mx-auto glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Reveal key={s.v} delay={i * 0.05}>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl text-grad">{s.k}</div>
              <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.v}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
