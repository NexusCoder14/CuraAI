"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

// "Beauty Intelligence Sphere": a layered SVG orb that reacts to the cursor.
// Inspired by Apple Siri orb + Vision Pro environment lighting.
export function Sphere() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [12, -12]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2))));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div ref={ref} className="relative w-[420px] h-[420px] md:w-[520px] md:h-[520px] flex items-center justify-center">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-70"
        style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.5), rgba(34,211,238,0.25) 50%, transparent 75%)" }} />
      {/* Rotating rings */}
      <motion.div className="absolute inset-8 rounded-full border border-white/10 animate-spin_slow" />
      <motion.div className="absolute inset-16 rounded-full border border-white/5"
        animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
      {/* Particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const r = 180 + (i % 3) * 30;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/70"
            style={{ x, y, boxShadow: "0 0 10px rgba(167,139,250,0.8)" }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.2, 0.6] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.15 }}
          />
        );
      })}
      {/* Core orb */}
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
        className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full"
      >
        <div className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7), rgba(139,92,246,0.7) 28%, rgba(59,130,246,0.6) 55%, rgba(232,121,249,0.5) 78%, rgba(10,15,36,0.95) 100%)",
            boxShadow: "0 30px 100px -20px rgba(139,92,246,0.6), inset 0 -30px 80px rgba(34,211,238,0.3), inset 0 30px 60px rgba(255,255,255,0.15)",
          }}
        />
        {/* highlight */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-[8%] left-[18%] w-[40%] h-[28%] rounded-full bg-white/40 blur-2xl" />
        </div>
        {/* iris ring */}
        <div className="absolute inset-[28%] rounded-full border border-white/30 animate-pulse_glow"
          style={{ boxShadow: "inset 0 0 30px rgba(34,211,238,0.6), 0 0 30px rgba(139,92,246,0.6)" }} />
        {/* center pupil */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[42%] rounded-full bg-bg"
          style={{ boxShadow: "inset 0 0 20px rgba(232,121,249,0.6), 0 0 20px rgba(139,92,246,0.8)" }}
        />
      </motion.div>
    </div>
  );
}
