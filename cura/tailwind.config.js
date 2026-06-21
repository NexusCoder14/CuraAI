/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        spin_slow: { to: { transform: "rotate(360deg)" } },
        pulse_glow: {
          "0%,100%": { opacity: "0.7", filter: "blur(20px)" },
          "50%": { opacity: "1", filter: "blur(30px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        spin_slow: "spin_slow 22s linear infinite",
        pulse_glow: "pulse_glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
