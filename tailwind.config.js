const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "terminal-black": "#050505",
        "terminal-dark": "#0A0F14",
        scanline: "rgba(0,0,0,0.5)",
        "accent-neon-green": "#FF5F00",
        "accent-cyber-yellow": "#E0FF00",
        "accent-electric-cyan": "#00F0FF",
        "accent-hot-pink": "#BC13FE",
        "accent-cyber-cyan": "#00F0FF",
        "accent-radical-red": "#FF003C",
        "accent-electric-violet": "#BC13FE",
        "accent-acid-yellow": "#E0FF00",
        "accent-cutrun-orange": "#FF5F00",
        hologram: "#E0E0E0",
        dim: "#6B7280",
        hud: "#333333"
      },
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
