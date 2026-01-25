/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        // Game of Joy color palette - Dark Mode
        'electric-blue': '#004AEF',
        'vibrant-green': '#00FF6C', 
        'warm-yellow': '#FFD300',
        'deep-charcoal': '#000000',
        'charcoal': '#0A0A0A',
        'charcoal-light': '#121212',
        'text-light': '#FEAEAEA',
        'text-white': '#FFFFFF',
        // Light Mode colors
        'light-bg': '#F8F5FF',        // Subtle purple tint
        'light-surface': '#FFFFFF',
        'light-border': '#E0E0E0',
        'light-text': '#1A1A1A',
        'light-text-secondary': '#666666',
        // Light Mode Accent Colors
        'light-purple': '#8B5CF6',    // Vibrant purple
        'light-pink': '#EC4899',      // Hot pink
        'light-blue': '#3B82F6',      // Bright blue
        'light-magenta': '#D946EF',   // Magenta (replaces yellow in light mode)
        'light-violet': '#8B5CF6',    // Violet
        'light-purple-soft': '#C4B5FD', // Soft purple for backgrounds
        'light-pink-soft': '#FBCFE8',   // Soft pink for backgrounds
        'light-magenta-soft': '#F5D0FE', // Soft magenta for backgrounds
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 74, 239, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 108, 0.5)',
        'neon-yellow': '0 0 20px rgba(255, 211, 0, 0.5)',
      },
      animation: {
        'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 255, 108, 0.5), 0 0 10px rgba(0, 255, 108, 0.5), 0 0 15px rgba(0, 255, 108, 0.5)' 
          },
          '100%': { 
            boxShadow: '0 0 10px rgba(0, 255, 108, 0.8), 0 0 20px rgba(0, 255, 108, 0.8), 0 0 30px rgba(0, 255, 108, 0.8)' 
          },
        }
      }
    },
  },
}
