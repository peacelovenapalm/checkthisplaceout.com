const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "terminal-black": "#050505",
        "terminal-dark": "#0a0f14",
        scanline: "rgba(0,0,0,0.5)",
        "accent-neon-green": "#00ff41",
        "accent-cyber-yellow": "#fcee0a",
        "accent-electric-cyan": "#00f0ff",
        "accent-hot-pink": "#ff00ff",
        "accent-cyber-cyan": "#00f0ff",
        "accent-radical-red": "#ff00ff",
        "accent-electric-violet": "#ff00ff",
        "accent-acid-yellow": "#fcee0a",
        "accent-cutrun-orange": "#00ff41",
        "text-hologram": "#e0e0e0",
        "text-dim": "#6b7280",
        "border-hud": "#333333",
        hologram: "#e0e0e0",
        dim: "#6b7280",
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
