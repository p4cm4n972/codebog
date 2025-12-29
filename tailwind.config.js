/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-press-start-2p)'],
      },
      colors: {
        'bog-green': '#16a085',
        'bog-green-dark': '#10705f',
        'bog-green-light': '#1abc9c',
        'bog-blue': '#2980b9',
        'bog-blue-dark': '#20638f',
        'bog-blue-light': '#3498db',
      },
      backgroundImage: {
        'bog-mobile': "url('/bg-bog-mobile.webp')",
        'bog-desktop': "url('/bg-bog-desktop.webp')",
      },
    },
  },
  plugins: [],
}
