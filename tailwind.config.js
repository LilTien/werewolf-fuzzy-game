/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This overrides Tailwind's default sans font stack
        // sans: ['"Plus Jakarta Sans"', 'sans-serif'], 
        
        // If you used a local game font from Option B, do this instead:
        sans: ['PixelFont', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}