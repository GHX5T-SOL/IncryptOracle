/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ffb500', // Binance Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#121212', // Main dark background
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'holographic': 'linear-gradient(135deg, rgba(255, 181, 0, 0.3) 0%, rgba(255, 181, 0, 0.1) 50%, rgba(255, 181, 0, 0.3) 100%)',
        'liquid-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'holographic': '0 0 20px rgba(255, 181, 0, 0.5), 0 0 40px rgba(255, 181, 0, 0.3), 0 0 60px rgba(255, 181, 0, 0.1)',
        'glow': '0 0 20px rgba(255, 181, 0, 0.4)',
        'liquid': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'particle-float': 'particle-float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(255, 181, 0, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 181, 0, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'particle-float': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)', opacity: '0.5' },
          '33%': { transform: 'translate(-20px, -10px) rotate(120deg)', opacity: '1' },
          '66%': { transform: 'translate(20px, -5px) rotate(240deg)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
