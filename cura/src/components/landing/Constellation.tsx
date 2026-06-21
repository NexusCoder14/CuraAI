import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Scissors, Droplet, Flame } from "lucide-react";

/**
 * Orbital Beauty Constellation
 * ---------------------------------
 * A signature hero visual for CURA. Three tilted orbital rings carry "beauty signals"
 * (Hair, Skin, Style, Glow) around a faceted prismatic core. The whole system reacts
 * to the user's cursor with subtle 3D parallax. Built with pure SVG + Framer Motion —
 * no canvas, no three.js, perfectly crisp at any size.
 */
export function Constellation() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 100, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 100, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2))));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div
      ref={ref}
      className="relative w-[360px] h-[360px] md:w-[540px] md:h-[540px] flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Soft outer halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.45), rgba(34,211,238,0.18) 55%, transparent 80%)",
        }}
      />

      {/* The tiltable scene */}
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* HUD scanline */}
        <div className="absolute inset-12 rounded-full overflow-hidden opacity-40 pointer-events-none">
          <motion.div
            className="absolute inset-x-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(34,211,238,0.9), rgba(139,92,246,0.9), transparent)",
              boxShadow: "0 0 18px rgba(34,211,238,0.8)",
            }}
            animate={{ y: ["0%", "100%", "0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Orbital rings (SVG so strokes stay crisp at any scale) */}
        <OrbitRing tiltDeg={0}    duration={28} delay={0}    color="rgba(167,139,250,0.55)" />
        <OrbitRing tiltDeg={62}   duration={36} delay={-12}  color="rgba(34,211,238,0.55)"  reverse />
        <OrbitRing tiltDeg={-58}  duration={42} delay={-6}   color="rgba(232,121,249,0.5)"  />

        {/* Constellation dots — slowly drifting */}
        <Stars />

        {/* Floating beauty-signal chips orbiting at different radii */}
        <SignalChip icon={Scissors} label="Hair" hue="violet" radius={180} duration={30} startDeg={0}   />
        <SignalChip icon={Droplet}  label="Skin" hue="cyan"   radius={210} duration={42} startDeg={120} />
        <SignalChip icon={Sparkles} label="Glow" hue="plasma" radius={170} duration={36} startDeg={240} reverse />
        <SignalChip icon={Flame}    label="Style" hue="aurora" radius={230} duration={48} startDeg={60} reverse />

        {/* Central prismatic core */}
        <Core />
      </motion.div>

      {/* Corner HUD ticks */}
      {[
        "top-2 left-2",   "top-2 right-2",
        "bottom-2 left-2", "bottom-2 right-2",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-6 h-6 pointer-events-none`}>
          <div className="absolute top-0 left-0 w-3 h-px bg-white/30" />
          <div className="absolute top-0 left-0 h-3 w-px bg-white/30" />
        </div>
      ))}
    </div>
  );
}

/* ---------- The core: faceted prism + glowing iris ---------- */
function Core() {
  return (
    <div className="relative w-[160px] h-[160px] md:w-[220px] md:h-[220px]" style={{ transformStyle: "preserve-3d" }}>
      {/* outer aurora glow behind core */}
      <div
        className="absolute -inset-10 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.7), rgba(232,121,249,0.4) 40%, transparent 70%)",
        }}
      />

      {/* Rotating faceted prism */}
      <motion.svg
        viewBox="-100 -100 200 200"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="prismA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.95" />
            <stop offset="60%"  stopColor="#3b82f6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0a0f24" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="prismB" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="prismCore" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%"  stopColor="#c4b5fd" stopOpacity="0.85" />
            <stop offset="80%"  stopColor="#7c3aed" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a0f24" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Hexagonal prism faces (gives a crystalline, faceted look) */}
        <g opacity="0.95">
          {hexFaces.map((d, i) => (
            <path key={i} d={d} fill={i % 2 ? "url(#prismA)" : "url(#prismB)"} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
          ))}
        </g>

        {/* Inner luminous core */}
        <circle cx="0" cy="0" r="44" fill="url(#prismCore)" />

        {/* Highlight specular */}
        <ellipse cx="-12" cy="-16" rx="14" ry="8" fill="white" opacity="0.35" />
      </motion.svg>

      {/* Counter-rotating thin ring for double-layer effect */}
      <motion.svg
        viewBox="-100 -100 200 200"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="0" cy="0" r="68" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" strokeDasharray="3 6" />
        <circle cx="0" cy="0" r="68" fill="none" stroke="url(#prismA)" strokeWidth="0.4" />
      </motion.svg>

      {/* Pulsing inner pupil */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
        style={{
          background: "radial-gradient(circle, #fff 0%, #e879f9 60%, transparent 100%)",
          boxShadow: "0 0 22px rgba(232,121,249,0.9), 0 0 50px rgba(139,92,246,0.6)",
        }}
      />
    </div>
  );
}

// Pre-computed hexagonal prism face paths (6 triangles meeting at center)
const hexFaces = (() => {
  const r = 72;
  const pts: [number, number][] = Array.from({ length: 6 }).map((_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  return pts.map((p, i) => {
    const n = pts[(i + 1) % 6];
    return `M 0 0 L ${p[0].toFixed(2)} ${p[1].toFixed(2)} L ${n[0].toFixed(2)} ${n[1].toFixed(2)} Z`;
  });
})();

/* ---------- Orbital ring (SVG, tilted in 3D) ---------- */
function OrbitRing({
  tiltDeg, duration, delay = 0, color, reverse = false,
}: { tiltDeg: number; duration: number; delay?: number; color: string; reverse?: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ transform: `rotateX(${tiltDeg}deg)`, transformStyle: "preserve-3d" }}
    >
      <motion.svg
        viewBox="-100 -100 200 200"
        className="w-[88%] h-[88%]"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      >
        <defs>
          <linearGradient id={`o-${tiltDeg}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="0" cy="0" r="95" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
        <circle cx="0" cy="0" r="95" fill="none" stroke={`url(#o-${tiltDeg})`} strokeWidth="1.2" />
        {/* Comet-like leading dot */}
        <circle cx="95" cy="0" r="2.4" fill="white" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </motion.svg>
    </motion.div>
  );
}

/* ---------- Floating signal chips orbiting the core ---------- */
function SignalChip({
  icon: Icon, label, hue, radius, duration, startDeg, reverse = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hue: "violet" | "cyan" | "plasma" | "aurora";
  radius: number;
  duration: number;
  startDeg: number;
  reverse?: boolean;
}) {
  const hueMap = {
    violet: { bg: "from-violet/30 to-violet/5",  ring: "rgba(167,139,250,0.6)", text: "text-violet" },
    cyan:   { bg: "from-cyan/30 to-cyan/5",      ring: "rgba(34,211,238,0.6)",  text: "text-cyan"   },
    plasma: { bg: "from-plasma/30 to-plasma/5",  ring: "rgba(232,121,249,0.6)", text: "text-plasma" },
    aurora: { bg: "from-aurora/30 to-aurora/5",  ring: "rgba(59,130,246,0.6)",  text: "text-aurora" },
  } as const;
  const c = hueMap[hue];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: 1, height: 1 }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      initial={{ rotate: startDeg }}
    >
      <div style={{ transform: `translate(${radius}px, 0)` }}>
        {/* Counter-rotate the chip itself so its text stays upright */}
        <motion.div
          animate={{ rotate: reverse ? 360 : -360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
          initial={{ rotate: -startDeg }}
        >
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-br ${c.bg} backdrop-blur-md border`}
            style={{
              borderColor: c.ring,
              boxShadow: `0 0 18px -4px ${c.ring}, inset 0 1px 0 rgba(255,255,255,0.15)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Icon className={`w-3 h-3 ${c.text}`} />
            <span className="text-[10px] font-medium tracking-wide text-ink whitespace-nowrap">{label}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------- Background star field ---------- */
function Stars() {
  // Pre-computed positions on a unit circle so it's stable across renders.
  const stars = Array.from({ length: 22 }).map((_, i) => {
    const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.3;
    const r = 100 + (i % 5) * 22;
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r, d: 2 + (i % 4) };
  });
  return (
    <>
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/80"
          style={{
            left: "50%", top: "50%", x: s.x, y: s.y,
            boxShadow: "0 0 8px rgba(196,181,253,0.85)",
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.3, 0.6] }}
          transition={{ duration: s.d, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}
