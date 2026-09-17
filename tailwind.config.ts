import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080B11",
        surface: "#0F172A",
        surfaceHover: "#1E293B",
        borderDark: "#1E293B",
        botCyan: {
          DEFAULT: "#06B6D4",
          light: "#22D3EE",
          dark: "#0891B2",
          glow: "rgba(6, 182, 212, 0.25)",
        },
        botEmerald: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
          glow: "rgba(16, 185, 129, 0.25)",
        },
        botPurple: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#7C3AED",
          glow: "rgba(139, 92, 246, 0.25)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        cyanGlow: "0 0 25px -5px rgba(6, 182, 212, 0.3)",
        emeraldGlow: "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        purpleGlow: "0 0 25px -5px rgba(139, 92, 246, 0.3)",
        card: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
