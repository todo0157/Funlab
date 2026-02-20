/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fececa',
          300: '#fcaba5',
          400: '#f87c73',
          500: '#ef5350',
          600: '#dc3030',
          700: '#b92525',
          800: '#992323',
          900: '#7f2323',
        },
      },
    },
  },
  plugins: [],
};
