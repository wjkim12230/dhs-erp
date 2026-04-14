import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#005BAC',
          50: '#e6f0fa',
          100: '#b3d4f0',
          200: '#80b8e6',
          300: '#4d9cdc',
          400: '#1a80d2',
          500: '#005BAC',
          600: '#004d93',
          700: '#003f7a',
          800: '#003161',
          900: '#002348',
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: { DEFAULT: '#005BAC', foreground: '#fff' },
          },
        },
      },
    }),
  ],
};
