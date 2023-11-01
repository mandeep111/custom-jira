import plugin from 'tailwindcss/plugin';

interface IconClasses {
    [key: string]: {
        width: string;
        height: string;
        marginRight: string;
    };
}

const loopWidthPercent = () => {
    const width: Record<string, string> = {};
    for (let i = 1; i <= 100; i++) {
        width[`${i}/100`] = `${i}%`;
    }
    return width;
};

const loopHeightPercent = () => {
    const height: Record<string, string> = {};
    for (let i = 1; i <= 100; i++) {
        height[`${i}/100`] = `${i}%`;
    }
    height['112'] = '28rem';
    height['128'] = '32rem';
    height['144'] = '36rem';
    height['160'] = '40rem';
    return height;
};

const generateIconClasses = () => {
    const iconClasses: IconClasses = {};
    for (let size = 4; size <= 256; size += 4) {
        iconClasses[`.icon-x${size}`] = {
            width: `${size}px`,
            height: `${size}px`,
            marginRight: '0.5rem'
        };
    }
    return iconClasses;
};

module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,jsx,ts,tsx,css}',
        './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'
    ],
    theme: {
        extend: {
            textColor: {
                default: 'var(--text-default-color)',
            },
            backgroundColor: {
                default: 'var(--bg-default-color)',
                'default-faded': 'var(--bg-default-color-faded)',
                'slate': {
                    50: 'rgb(252, 252, 252)',
                    100: 'rgb(216, 216, 216)',
                    200: 'rgb(192, 192, 192)',
                    300: 'rgb(180, 180, 180)',
                    400: 'rgb(168, 168, 168)',
                    500: 'rgb(84, 84, 84)',
                    600: 'rgb(72, 72, 72)',
                    700: 'rgb(36, 36, 36)',
                    800: 'rgb(24, 24, 24)',
                    900: 'rgb(12, 12, 12)',
                    950: 'rgb(0, 0, 0)'
                },
                'gray': {
                    50: 'rgb(252, 252, 252)',
                    100: 'rgb(216, 216, 216)',
                    200: 'rgb(192, 192, 192)',
                    300: 'rgb(180, 180, 180)',
                    400: 'rgb(168, 168, 168)',
                    500: 'rgb(156, 156, 156)',
                    600: 'rgb(96, 144, 144)',
                    700: 'rgb(72, 72, 72)',
                    800: 'rgb(60, 60, 60)',
                    900: 'rgb(48, 48, 48)',
                    950: 'rgb(36, 36, 36)'
                },
            },
            borderColor: {
                default: 'var(--border-default-color)',
                'slate': {
                    50: 'rgb(254, 254, 254)',
                    100: 'rgb(240, 240, 240)',
                    200: 'rgb(180, 180, 180)',
                    300: 'rgb(132, 132, 132)',
                    400: 'rgb(96, 96, 96)',
                    500: 'rgb(84, 84, 84)',
                    600: 'rgb(72, 72, 72)',
                    700: 'rgb(36, 36, 36)',
                    800: 'rgb(24, 24, 24)',
                    900: 'rgb(12, 12, 12)',
                    950: 'rgb(0, 0, 0)'
                },
                'gray': {
                    50: 'rgb(252, 252, 252)',
                    100: 'rgb(216, 216, 216)',
                    200: 'rgb(192, 192, 192)',
                    300: 'rgb(180, 180, 180)',
                    400: 'rgb(168, 168, 168)',
                    500: 'rgb(156, 156, 156)',
                    600: 'rgb(96, 144, 144)',
                    700: 'rgb(72, 72, 72)',
                    800: 'rgb(60, 60, 60)',
                    900: 'rgb(48, 48, 48)',
                    950: 'rgb(36, 36, 36)'
                },
            },
            ringColor: {
                default: 'var(--ring-default-color)'
            },
            width: loopWidthPercent,
            height: loopHeightPercent,
            maxHeight: loopHeightPercent,
        },

    },
    plugins: [
        plugin(function ({ addBase }) {
            addBase({
                ...generateIconClasses(),
            });
        })
    ],
};