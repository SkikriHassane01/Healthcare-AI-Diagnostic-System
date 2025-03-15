/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7', // sky-600
          dark: '#0369a1', // sky-700
          light: '#0ea5e9', // sky-500
        },
        secondary: {
          DEFAULT: '#4f46e5', // indigo-600
          dark: '#4338ca', // indigo-700
          light: '#6366f1', // indigo-500
        },
        success: {
          DEFAULT: '#059669', // emerald-600
          dark: '#047857', // emerald-700
          light: '#10b981', // emerald-500
        },
        warning: {
          DEFAULT: '#d97706', // amber-600
          dark: '#b45309', // amber-700
          light: '#f59e0b', // amber-500
        },
        error: {
          DEFAULT: '#dc2626', // rose-600
          dark: '#b91c1c', // rose-700
          light: '#ef4444', // rose-500 
        },
        background: {
          light: '#f8fafc', // slate-50
          dark: '#0f172a', // slate-900
        },
        card: {
          light: '#ffffff', // white
          dark: '#1e293b', // slate-800
        },
        surface: {
          light: '#f1f5f9', // slate-100
          dark: '#334155', // slate-700
        },
      }
    },
  },
  plugins: [
    import('@tailwindcss/typography'),
  ],
}