/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        screens: {
            'xxl': '1536px',
        },
      colors: {
        ...colors,
        'dark-gunmetal':'#1e1e2e',
        'gunmetal': '#282a36',
        'tuna': '#343642',
        'eerie-black': '#16161f',
        'cultured': '#f8f8f2',
        'muted-blue': '#2a2a3e',
        'arsenic': '#3a3a4e',
        'subtle-gray': '#20202f',
        'chinese-black': '#0e0e16',
        'persian-pink': '#ff79c6',
        'key-lime': '#f1fa8c',
        'cyan': '#8be9fd',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        'cutive-mono': ['"Cutive Mono"', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
        'sans': ['Source Sans Pro', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
