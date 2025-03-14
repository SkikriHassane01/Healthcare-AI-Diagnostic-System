/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here
        primary: '#3b82f6', // blue-500
        secondary: '#6b7280', // gray-500
        accent: '#10b981', // emerald-500
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}