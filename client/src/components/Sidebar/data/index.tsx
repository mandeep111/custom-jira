import React from 'react';
import { ChartPieIcon, HomeIcon, BellIcon } from '@heroicons/react/24/outline';

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
        },
        {
            name: 'Notification',
            url: '/notification',
            tags: 'notification',
            icon: () => <BellIcon className="icon-x16" />,
            child: []
        }
    ];

    return { general };

};



export default Data;