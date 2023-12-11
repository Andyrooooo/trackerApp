/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './styles.css', './output.css', './track.js'],
  theme: {
    extend: {
      inset: {
        '-4': '-1rem',
      }
    },
  },
  plugins: [],
}

