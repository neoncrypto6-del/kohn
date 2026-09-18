export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8ed',
          100: '#f9ebcb',
          200: '#f2d493',
          300: '#e9b757',
          400: '#e2a033',
          500: '#c8860d',
          600: '#a86c09',
          700: '#82520b',
          800: '#5d3a0c',
          900: '#3d270b',
        },
        ink: {
          50: '#f6f6f5',
          100: '#e9e8e6',
          200: '#d2d0cc',
          300: '#aaa7a1',
          400: '#7c7873',
          500: '#5a5650',
          600: '#413e39',
          700: '#2c2a26',
          800: '#1c1b18',
          900: '#121110',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
}
