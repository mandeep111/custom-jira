import React from 'react';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';
import { ChevronDoubleLeftIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Logo = () => {
    const [appearance, setAppearance] = React.useState<string>(localStorage.getItem('theme') || '');
    const darkModeRef: React.RefObject<SVGSVGElement> = React.useRef(null);
    const lightModeRef: React.RefObject<SVGSVGElement> = React.useRef(null);

    if (appearance === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const handleThemeToggle: () => void = () => {
        darkModeRef.current?.classList.toggle('hidden');
        lightModeRef.current?.classList.toggle('hidden');

        if (appearance) {
            if (appearance === 'light') {
                document.documentElement.classList.add('dark');
                setAppearance('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                setAppearance('light');
                localStorage.setItem('theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                setAppearance('light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                setAppearance('dark');
                localStorage.setItem('theme', 'dark');
            }
        }
    };

    React.useEffect(() => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            lightModeRef.current?.classList.remove('hidden');
        } else {
            darkModeRef.current?.classList.remove('hidden');
        }
    }, []);

    return (

        <div className="flex items-center">
            <Link to="/">
                <img
                    src={localStorage.getItem('theme') === 'dark' ? logoLight : logoDark}
                    className="p-3"
                    alt="LACONIC"
                />
            </Link>
            <div className="ml-auto">
                <button type="button"
                    className="button mr-1"
                    onClick={handleThemeToggle}
                >
                    <SunIcon ref={darkModeRef} className="hidden icon-x20 mr-0" />
                    <MoonIcon ref={lightModeRef} className="hidden icon-x20 mr-0" />
                </button>
                <button type="button" className="button">
                    <ChevronDoubleLeftIcon className="icon-x20 mr-0" />
                </button>
            </div>
        </div>
    );
};

export default Logo;
