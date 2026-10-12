/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tak: {
          green: {
            DEFAULT: '#27ae60',
            dark: '#1e824c',
            darker: '#166534',
            light: '#ebf7ee',
            hover: '#219653',
            border: '#a3e635',
            active: '#83c224'
          },
          blue: {
            DEFAULT: '#0288d1',
            light: '#e1f5fe',
            card: '#dcf1f6'
          },
          text: {
            DEFAULT: '#2c3e50',
            muted: '#64748b',
            heading: '#1e293b'
          }
        }
      }
    },
  },
  plugins: [],
};
