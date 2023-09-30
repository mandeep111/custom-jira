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
    content: ['./src/**/*.{html,js,jsx,ts,tsx,css}'],
    theme: {
        extend: {
            textColor: {
                default: 'var(--text-default-color)',
            },
            backgroundColor: {
                default: 'var(--bg-default-color)',
                'default-faded': 'var(--bg-default-color-faded)',
            },
            borderColor: {
                default: 'var(--border-default-color)'
            },
            ringColor: {
                default: 'var(--ring-default-color)'
            },
            width: loopWidthPercent,
            height: loopHeightPercent,
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