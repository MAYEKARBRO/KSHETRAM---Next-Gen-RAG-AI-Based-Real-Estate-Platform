/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prussian: {
          DEFAULT: '#102542',
          50: '#f0f4fa',
          100: '#dce5f2',
          200: '#bccce6',
          300: '#94aed5',
          400: '#648ac0',
          500: '#436aa8',
          600: '#32528a',
          700: '#28416f',
          800: '#1b2d4e',
          900: '#102542',
          950: '#0a1628',
        },
        coral: {
          DEFAULT: '#F87060',
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfc9',
          300: '#fcaaa0',
          400: '#f87060',
          500: '#ee4c3a',
          600: '#db3320',
          700: '#b82717',
          800: '#982417',
          900: '#7e241a',
        },
        alabaster: {
          DEFAULT: '#CDD7D6',
          50: '#f8faf9',
          100: '#edf2f1',
          200: '#dde5e4',
          300: '#cdd7d6',
          400: '#aab8b6',
          500: '#8b9b99',
          600: '#6e7e7c',
          700: '#596664',
          800: '#4a5453',
          900: '#404847',
        },
        khaki: {
          DEFAULT: '#B3A394',
          50: '#f8f7f5',
          100: '#efece8',
          200: '#ded7d0',
          300: '#c7bcb1',
          400: '#b3a394',
          500: '#9a8776',
          600: '#837161',
          700: '#6a5b4f',
          800: '#594d43',
          900: '#4c423b',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(16, 37, 66, 0.12), 0 0 15px rgba(248, 112, 96, 0.05)',
        'coral-glow': '0 0 25px rgba(248, 112, 96, 0.35)',
        'prussian-card': '0 10px 30px -5px rgba(16, 37, 66, 0.08)',
      }
    },
  },
  plugins: [],
}

