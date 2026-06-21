import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050816",
        surface: "#0a0f24",
        ink: "#e8ecff",
        muted: "#7d86b8",
        violet: "#8b5cf6",
        cyan: "#22d3ee",
        aurora: "#3b82f6",
        plasma: "#e879f9",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backgroundImage: {
        "aurora": "radial-gradient(60% 50% at 20% 20%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(50% 50% at 80% 10%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(60% 60% at 60% 90%, rgba(232,121,249,0.18), transparent 60%)",
        "grid": "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spin_slow: { to: { transform: "rotate(360deg)" } },
        pulse_glow: {
          "0%,100%": { opacity: "0.7", filter: "blur(20px)" },
          "50%": { opacity: "1", filter: "blur(30px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        spin_slow: "spin_slow 22s linear infinite",
        pulse_glow: "pulse_glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
