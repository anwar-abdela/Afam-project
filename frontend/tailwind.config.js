/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e7ff',
                    500: '#2563eb', // Trust Blue
                    600: '#1d4ed8',
                    700: '#1e40af',
                },
                accent: {
                    DEFAULT: '#f97316', // Action Orange
                    hover: '#ea580c',
                }
            }
        },
    },
    plugins: [],
}
