import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarSapce } from '.';
import { Logo } from '../Logo';
import Data from './data';

const Component = () => {

    const { general } = Data();

    return (
        <React.Fragment>
            <aside className="flex flex-col max-sm:hidden bg-default w-80 p-2 min-h-screen max-h-screen border-r border-default">
                <Logo />
                <div className="relative mb-2">
                    <div className="absolute -inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-default">
                        <HeroIcons.MagnifyingGlassIcon className="icon-x16" />
                    </div>
                    <input
                        type="text"
                        className="text-default bg-default border border-default outline-none rounded-lg block w-full pl-10 p-2.5"
                        placeholder="Search"
                    />
                </div>
                <nav>
                    {general.map((data, index) => (
                        <Link to={data.url} key={index}
                            className="flex items-center text-default py-2.5 px-4 rounded transition duration-200 hover:bg-default-faded">
                            {data.icon && data.icon()}&nbsp;{data.name}
                        </Link>
                    ))}
                    <hr className="pb-2 mt-2" />
                    <SidebarSapce />
                </nav >
                <div className="block mt-auto">
                    <hr className="pb-2" />
                    <button type="button" className="button">
                        <HeroIcons.UserPlusIcon className="icon-x16" />
                        <span>{'Invite'}</span>
                    </button>
                    <Link to="/logout"
                        title="Logout"
                        className="button float-right"
                    >
                        <HeroIcons.PowerIcon className="icon-x16 mr-0" />
                    </Link>
                </div>
            </aside >
        </React.Fragment >
    );
};

export default Component;