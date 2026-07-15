/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        charcoal: '#0D0D0D',
        surface: '#141414',
        cream: '#FFFFFF',
        muted: '#B5B5B5',
        gold: '#C8A96A',
        'gold-soft': '#e0c99a',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1440px',
      },
      letterSpacing: {
        luxe: '0.28em',
      },
      borderRadius: {
        luxe: '32px',
      },
      spacing: {
        luxe: '10rem', // 160px luxury spacing
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        600: '600ms',
        1000: '1000ms',
        1500: '1500ms',
      },
    },
  },
  plugins: [],
}
