/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#9333ea',
          700: '#7c3aed',
        },
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          600: '#4b5563',
          700: '#374151',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
} 