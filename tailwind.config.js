// tailwind.config.js
const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/components/(accordion|alert|avatar|button|card|chip|code|dropdown|form|input|kbd|link|listbox|modal|navbar|select|snippet|spinner|toggle|divider|ripple|menu|popover|scroll-shadow).js',
  ],
  theme: {
    extend: {
      // Custom color palette extracted from design system
      colors: {
        // Brand colors
        brand: {
          primary: '#006FEE',
          secondary: '#9353D3',
          success: '#17C964',
          warning: '#F5A524',
          danger: '#F31260',
        },
      },

      // Custom font families
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },

      // Custom spacing values
      spacing: {
        14: '3.5rem',
      },

      // Custom border radius
      borderRadius: {
        '3xl': '2rem',
      },

      // Custom animations
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      },

      // Custom transition timing functions
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
};
