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
                'library-left-full': '100px',
                'library-left': '80px',
            },
            colors: {
                'theme-alpha': '#F8C300',
                'theme-alpha-dim': '#FFF9E3',
            }
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/forms'),
        require('flowbite/plugin')
    ],
}
