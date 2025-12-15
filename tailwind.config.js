/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'win-bg': '#f3f3f3',
                'win-glass': 'rgba(255, 255, 255, 0.7)',
                'taskbar-glass': 'rgba(243, 243, 243, 0.85)',
            },
            fontFamily: {
                'segoe': ['"Segoe UI"', 'Roboto', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
