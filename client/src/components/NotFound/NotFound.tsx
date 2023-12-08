import { ChevronLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Component = () => {

    const navigate = useNavigate();

    const handleGoback: () => void = () => {
        navigate(-1);
    };

    const handleGoHome: () => void = () => {
        navigate('/');
    };

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    return (
        <React.Fragment>
            <div className="bg-white">
                <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
                    <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                        <p className="p-3 text-sm font-medium text-blue-400 rounded-full bg-blue-50 dark:bg-gray-800">
                            <ExclamationCircleIcon className="icon-32x32" />
                        </p>
                        <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">{'Page not found'}</h1>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">{'The page you are looking for doesn\'t exist. Here are some helpful links:'}</p>
                        <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                            <button
                                type="button"
                                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
                                onClick={handleGoback}
                            >
                                <ChevronLeftIcon className="icon-16x16" />
                                <span>{'Go back'}</span>
                            </button>
                            <button
                                type="button"
                                className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
                                onClick={handleGoHome}
                            >
                                {'Take me home'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

};

export default Component;