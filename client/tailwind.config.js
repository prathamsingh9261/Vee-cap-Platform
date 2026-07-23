/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16213E",
          50: "#EEF1F8",
          100: "#D7DDEE",
          400: "#3A4A78",
          600: "#222E52",
          900: "#0F1730",
        },
        amber: {
          DEFAULT: "#E8A33D",
          50: "#FDF3E3",
          400: "#EFB75E",
          600: "#C9822A",
        },
        parchment: "#F7F4EC",
        ledger: "#FFFDF8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 14px rgba(22, 33, 62, 0.08)",
        cardHover: "0 8px 28px rgba(22, 33, 62, 0.14)",
      },
    },
  },
  plugins: [],
};
