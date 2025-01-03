/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
<<<<<<< HEAD
=======
    "./src/presets/**/*.{js,vue,ts}",
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  ],
  theme: {
    extend: {},
  },
<<<<<<< HEAD
  plugins: [],
=======
  plugins: [require('tailwindcss-primeui')]
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
}