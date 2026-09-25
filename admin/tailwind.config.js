/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          dark: '#141714',
          card: '#1e231e',
          border: '#2e352e',
          primary: '#22c55e',
          accent: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
