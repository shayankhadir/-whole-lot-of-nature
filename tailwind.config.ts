import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf7',
          100: '#dcfcec',
          200: '#bbf7da',
          300: '#86efbe',
          400: '#4ade9a',
          500: '#22c57d',
          600: '#0d9f6e',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Green shades for consistency (aliases to primary for flexibility)
        green: {
          50: '#f0fdf7',
          100: '#dcfcec',
          200: '#bbf7da',
          300: '#86efbe',
          400: '#4ade9a',
          500: '#22c57d',
          600: '#0d9f6e',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Cream shades for consistency (aliases to primary for flexibility)
        cream: {
          50: '#fdfbf5',
          100: '#f7f5ed',
          200: '#f3ede2',
          300: '#e8dfcc',
          400: '#d8cbb0',
          500: '#c2b08e',
          600: '#a6926d',
          700: '#857252',
          800: '#6b5a42',
          900: '#574a38',
          950: '#2e271d',
        },
        // Extended white, black, gray for neutral UI only
        white: '#ffffff',
        black: '#000000',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair-display)', 'serif'],
        montserrat: ['Montserrat', 'var(--font-inter)', 'sans-serif'],
        inter: ['Inter', 'var(--font-inter)', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
    },
  },
  plugins: [],
}
export default config