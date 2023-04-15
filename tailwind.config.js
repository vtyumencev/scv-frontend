const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', ...defaultTheme.fontFamily.sans],
                serif: ['Noto Serif', ...defaultTheme.fontFamily.serif],
            },
            maxWidth: {
                'site-container': '110rem',
            },
            spacing: {
                'container-inline': '20px',
                'container-library-inline': '100px',
            },
            colors: {
                'theme-alpha': '#F8C300',
                'theme-alpha-dim': '#FFF9E3',
                'theme-beta': '#66C6EF',
                'theme-omega': '#151515',
            }
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/forms'),
        require('flowbite/plugin')
    ],
}
