/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f1115',
        slate: '#5b6472',
        line: '#e7e9ee',
        panel: '#ffffff',
        canvas: '#f5f6f8',
        gold: '#C8A96A',
        brand: '#111318',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
