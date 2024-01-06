/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Default font for body text
        heading: ['Montserrat', 'sans-serif'], // Specific font for headings
      },
			colors: {
				primary: "#46C660"
			}
		},
	},
	plugins: [],
}
