import type { Config } from "tailwindcss";

const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: withAlpha("--bg"),
        surface: withAlpha("--surface"),
        primary: withAlpha("--primary"),
        accent: withAlpha("--accent"),
        fg: withAlpha("--fg"),
        muted: withAlpha("--muted"),
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--accent)) 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--primary) / 0.35), 0 12px 40px -12px rgb(var(--primary) / 0.45)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        rise: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        rise: "rise 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
