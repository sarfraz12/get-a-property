import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // or 'media' or 'class' for manual control
  theme: {
    extend: {
      keyframes: {
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.8) rotate(-10deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        staggeredBounce: {
          '0%': { transform: 'scale(0.8)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeInScale: 'fadeInScale 1s ease-in-out forwards',
        slideInLeft: 'slideInLeft 1s ease-in-out forwards',
        slideInRight: 'slideInRight 1s ease-in-out forwards',
        staggeredBounce: 'staggeredBounce 0.6s ease-out forwards',
      },

      colors: {
        brand: {
          DEFAULT: "#FFFFFF", // your gold #EBAA20
          dark: "#064396",    // dark backgrounds
          light: "#F2F1EC",   // light backgrounds
          black: "#000000",
          gold: "#EBAA20",
        },
      },
      fontFamily: {
        // to change, update font in _document.js
        sans: ["var(--font-garet)", "sans-serif"],
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16"
      }
    }
  },
  plugins: [require('@tailwindcss/container-queries'), require("@tailwindcss/typography"),],
};
export default config;
