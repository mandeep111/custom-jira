import React from 'react';
import { ChartPieIcon, HomeIcon } from '@heroicons/react/24/outline';

const Data = () => {

    const general = [
        {
            name: 'Home',
            url: '/',
            tags: 'home',
            icon: () => <HomeIcon className="icon-x16" />,
            child: []
        },
        {
            name: 'Report',
            url: '/report',
            tags: 'report',
            icon: () => <ChartPieIcon className="icon-x16" />,
            child: []
        }
    ];

    return { general };

};



export default Data;