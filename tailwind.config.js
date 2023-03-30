const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            maxWidth: {
                'site-container': '110rem',
            },
            spacing: {
                'container-inline': '20px',
                'library-left-full': '100px',
                'library-left': '80px',
            }
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/forms'),
        require('flowbite/plugin')
    ],
}
