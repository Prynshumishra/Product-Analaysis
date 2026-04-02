/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "var(--brand-primary)",
        },
        background: {
          main: "var(--bg-main)",
          card: "var(--bg-card)",
          subtle: "var(--bg-subtle)",
        },
        surface: {
          glass: "var(--surface-glass)",
          strong: "var(--surface-strong)",
        },
        border: {
          soft: "var(--border-soft)",
          medium: "var(--border-medium)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        state: {
          success: "var(--state-success)",
          danger: "var(--state-danger)",
          warning: "var(--state-warning)",
        }
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        rise: "rise 450ms ease-out forwards",
      },
      boxShadow: {
        card: "0 4px 28px -4px rgba(79,70,229,0.10)",
        glow: "0 0 0 3px rgba(79,70,229,0.18)",
        hover: "0 10px 36px -6px rgba(79,70,229,0.22)",
      }
    },
  },
  plugins: [],
}