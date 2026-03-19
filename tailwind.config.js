/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        'ink': '#0f0f0f',
        'muted': '#999999',
        'blue-accent': '#3b5bdb',
        'green-accent': '#2f9e44',
        'pill': '#e8e8e8',
        'border': '#e8e8e8',
        'light': '#f5f5f5',
        'dark': '#1a1a1a',
      },
      maxWidth: {
        'content': '1560px',
        'pill': 'calc(1560px - 80px)',
      },
      padding: {
        'page': '40px',
      },
      height: {
        'nav': '52px',
      },
    },
  },
  plugins: [],
}
