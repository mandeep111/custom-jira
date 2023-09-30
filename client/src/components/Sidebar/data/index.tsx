import React from 'react';
import { HomeIcon, TrophyIcon } from '@heroicons/react/24/outline';

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
            name: 'Goals',
            url: '#',
            tags: 'goal',
            icon: () => <TrophyIcon className="icon-x16" />,
            child: [
                {
                    name: 'List',
                    url: '#',
                    tags: 'list',
                    icon: () => <TrophyIcon className="icon-x16" />,
                    child: []
                }
            ]
        }
    ];

    const space = [
        {
            name: 'LACONIC',
            url: '/asdas',
            tags: 'laconic',
            color: '#3498DB',
            isOpen: true,
            child: [
                {
                    name: 'LACONIC',
                    url: '#',
                    tags: '',
                    child: []
                },
                {
                    name: 'LACONIC',
                    url: '/8888',
                    tags: '',
                    child: []
                },
            ]
        },
        {
            name: 'LACONIC',
            url: '/asdas',
            tags: 'laconic',
            color: '#3498DB',
            isOpen: true,
            child: []
        }
    ];

    return { general, space };

};



export default Data;