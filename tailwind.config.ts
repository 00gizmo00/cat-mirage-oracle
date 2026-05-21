import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        oracle: "0 0 36px rgba(168, 85, 247, 0.36), inset 0 0 24px rgba(255,255,255,0.08)",
        ur: "0 0 52px rgba(250, 204, 21, 0.42), 0 0 88px rgba(192, 132, 252, 0.28)",
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        pulseRune: "pulseRune 1.7s ease-in-out infinite",
        spinSlow: "spin 7s linear infinite",
        cardFlip: "cardFlip 0.95s ease both",
        shimmer: "shimmer 1.4s linear infinite",
        shake: "shake 0.6s ease-in-out both",
        urBurst: "urBurst 1.2s ease-out both",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseRune: {
          "0%, 100%": { opacity: "0.45", transform: "scale(0.96) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.04) rotate(12deg)" },
        },
        cardFlip: {
          "0%": { transform: "rotateY(90deg) scale(0.8)", opacity: "0" },
          "60%": { transform: "rotateY(-12deg) scale(1.04)", opacity: "1" },
          "100%": { transform: "rotateY(0deg) scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-110%) skewX(-16deg)" },
          "100%": { transform: "translateX(160%) skewX(-16deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(5px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(3px)" },
        },
        urBurst: {
          "0%": { opacity: "0", transform: "scale(0.5)", filter: "blur(10px)" },
          "45%": { opacity: "1", transform: "scale(1.12)", filter: "blur(0)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
