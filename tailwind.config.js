/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                right: '2px 0 2px 0 rgba(0,0,0,0.3)',
            },
            transitionProperty: {
                height: 'max-height',
                width: 'width',
            },
        },
    },
    plugins: [],
};
