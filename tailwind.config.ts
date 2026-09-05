import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        border: "var(--border)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        neuro: {
          light: {
            base: "#f0f4f8",
            highlight: "#ffffff",
            shadow: "#d1d9e6",
            text: "#1e293b",
            muted: "#64748b",
          },
          dark: {
            base: "#1f1f2e",
            highlight: "#29293d",
            shadow: "#15151f",
            text: "#f8fafc",
            muted: "#94a3b8",
          },
          accent: "#6ea0f7",
        },
      },
      boxShadow: {
        'neuro-flat-light': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neuro-flat-dark': '8px 8px 18px #15151f, -8px -8px 18px #29293d',
        'neuro-inset-light': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
        'neuro-inset-dark': 'inset 4px 4px 8px #15151f, inset -4px -4px 8px #29293d',
        'neuro-inset-focus-light': 'inset 5px 5px 9px #c4cddb, inset -5px -5px 9px #ffffff',
        'neuro-inset-focus-dark': 'inset 5px 5px 9px #11111a, inset -5px -5px 9px #2c2c40',
        'neuro-ring': '0 0 0 2px #6ea0f7, 0 0 12px rgba(110, 160, 247, 0.4)',
      },
      backgroundImage: {
        'neuro-pill-light': 'linear-gradient(145deg, #f8fcff, #e3e8ee)',
        'neuro-pill-dark': 'linear-gradient(145deg, #222233, #1c1c29)',
        'neuro-pill-active': 'linear-gradient(145deg, #6495ed, #7ab0ff)',
      },
      borderRadius: {
        'neuro-card': '24px',
        'neuro-input': '14px',
        'neuro-btn': '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
