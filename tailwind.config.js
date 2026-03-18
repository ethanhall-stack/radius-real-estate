/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#5553E0',
          light: '#8082f4',
          dark: '#3d3fb8',
          50: '#eef0ff',
          100: '#dde0ff',
        },
        cream: '#f2f3fd',
        charcoal: '#1a1f36',
      },
      letterSpacing: {
        widest: '0.3em',
      },
    },
  },
  plugins: [],
}
