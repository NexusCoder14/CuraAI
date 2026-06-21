"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "../shared/Reveal";

export function CTA() {
  return (
    <section className="relative px-6 py-24">
      <Reveal>
        <div className="max-w-5xl mx-auto glass-strong rounded-3xl p-12 relative overflow-hidden text-center">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-violet/40 via-aurora/30 to-plasma/40 blur-3xl opacity-60" />
          <div className="relative">
            <div className="chip mx-auto mb-5">Ready when you are</div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">
              Your beauty, <span className="text-grad">intelligently planned.</span>
            </h2>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              Spin up your Beauty Twin in under a minute. No credit card. Cancel reality anytime.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/twin/onboarding" className="btn-primary">
                <Sparkles className="w-4 h-4" /> Create Beauty Twin <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/chat" className="btn-ghost">Talk to AI</Link>
            </div>
          </div>
        </div>
      </Reveal>
      <div className="mt-16 text-center text-xs text-muted">
        © 2026 CURA AI · Mumbai, India · Built for the Beauty OS Hackathon
      </div>
    </section>
  );
}
