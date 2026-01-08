import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      colors: {
        navy: {
          900: '#0A1929', // Deep Midnight Navy (Background)
        },
        gold: {
          400: '#F3E5AB', // Light Gold
          500: '#D4AF37', // Antique Gold (Point)
          600: '#B8860B', // Dark Gold
        }
      }
    },
  },
  plugins: [],
};
export default config;
