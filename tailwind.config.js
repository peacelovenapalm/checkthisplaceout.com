const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono]
      },
      boxShadow: {
        "hard-cyan": "4px 4px 0 var(--color-cyan)",
        "hard-violet": "4px 4px 0 var(--color-violet)",
        "hard-orange": "4px 4px 0 var(--color-orange)"
      }
    }
  },
  plugins: []
};
