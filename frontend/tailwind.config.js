/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a", // slate-900
        darkCard: "#1e293b", // slate-800
        accentGreen: "#10b981", // emerald-500
        accentAmber: "#f59e0b", // amber-500
        accentOrange: "#ea580c", // orange-600
        textLight: "#f8fafc", // slate-50
        textGray: "#94a3b8", // slate-400
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 15px rgba(245, 158, 11, 0.4)",
        glowGreen: "0 0 15px rgba(16, 185, 129, 0.4)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
}
