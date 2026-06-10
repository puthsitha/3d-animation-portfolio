import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#111113",
          soft: "#52525b",
          faint: "#a1a1aa",
        },
        surface: {
          DEFAULT: "#ffffff",
          raised: "#fafafa",
          line: "#e8e8ec",
        },
        accent: {
          DEFAULT: "#3b82f6",
          soft: "#eff6ff",
        },
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
