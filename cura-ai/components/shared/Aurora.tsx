"use client";
import { motion } from "framer-motion";

export function Aurora() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0a0f24_0%,_#050816_60%)]" />
      {/* Aurora blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[60rem] h-[60rem] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.35), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[55rem] h-[55rem] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,211,238,0.28), transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, -30, 50, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/4 w-[50rem] h-[50rem] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,121,249,0.22), transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />
    </div>
  );
}
