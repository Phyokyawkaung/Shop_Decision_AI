/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        shop: {
          bg: '#030712',
          neon: '#38bdf8',
          gold: '#fbbf24',
          indigo: '#818cf8',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(56, 189, 248, 0.28)',
        'glow-gold': '0 0 24px rgba(251, 191, 36, 0.28)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
