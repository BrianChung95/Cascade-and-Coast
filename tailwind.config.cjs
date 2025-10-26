const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ed',
          100: '#ffe7d3',
          200: '#ffc7a8',
          300: '#ffaa7c',
          400: '#ff8a4f',
          500: '#fb6514',
          600: '#de4b0b',
          700: '#b4380a',
          800: '#7a260f',
          900: '#47150a'
        }
      },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        display: ['"Playfair Display"', ...defaultTheme.fontFamily.serif]
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
