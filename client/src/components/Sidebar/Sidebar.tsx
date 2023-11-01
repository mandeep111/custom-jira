import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { SidebarSpace } from '.';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';
import { setToggle } from '../../redux/Sidebar/actions';
import { getToggle } from '../../redux/Sidebar/selectors';
import { setTheme } from '../../redux/Theme/actions';
import FavoriteSpaceService from '../../services/FavoriteSpace';
import SpaceService from '../../services/Space';
import { Space } from '../../types/Space';
import { ContextMenuFavoriteSpace, ContextMenuFolder, ContextMenuProject, ContextMenuSpace } from '../ContextMenu';
import { FormChangeColorProject, FormChangeColorSpace, FormEditSpace, FormMoveFolder, FormMoveProject, FormNewFolder, FormNewProject, FormNewSpace, FormOpenFolder, FormRenameFolder, FormRenameProject, FormRenameSpace } from '../Form';
import Data from './data';

const Component = () => {

    const { general } = Data();
    const { spaceId } = useParams();
    const dispatch = useDispatch();
    const toggle = useSelector(getToggle);

    const [appearance, setAppearance] = React.useState<string>(localStorage.getItem('theme') || '');
    const darkModeRef: React.RefObject<SVGSVGElement> = React.useRef(null);
    const lightModeRef: React.RefObject<SVGSVGElement> = React.useRef(null);

    const handleSidebarToggle = () => {
        dispatch(setToggle(!toggle));
    };

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
                dispatch(setTheme('dark'));
                setAppearance('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                dispatch(setTheme('light'));
                setAppearance('light');
                localStorage.setItem('theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                dispatch(setTheme('light'));
                setAppearance('light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                dispatch(setTheme('dark'));
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

    const spaceRef = React.useRef<HTMLButtonElement | null>(null);
    const favoriteSpaceRef = React.useRef<HTMLButtonElement | null>(null);
    const projectRef = React.useRef<HTMLButtonElement | null>(null);
    const folderRef = React.useRef<HTMLButtonElement | null>(null);

    const [mySpaceList, setMySpaceList] = React.useState<Space[]>([]);
    const [favSpaceList, setFavSpaceList] = React.useState<Space[]>([]);

    const fetchMySpaceList = async () => await SpaceService.Fetch(setMySpaceList);
    const fetchFavSpaceList = async () => await FavoriteSpaceService.Fetch(setFavSpaceList);

    React.useEffect(() => {
        void fetchMySpaceList();
        void fetchFavSpaceList();
    }, [spaceId]);

    return (
        <React.Fragment>
            <aside className={`fixed top-0 left-0 h-screen transition-transform -translate-x-full bg-default w-80 p-2 border-r border-default ${toggle ? '' : 'transform translate-x-0'}`}>
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
                            <HeroIcons.SunIcon ref={darkModeRef} className="hidden icon-x20 mr-0" />
                            <HeroIcons.MoonIcon ref={lightModeRef} className="hidden icon-x20 mr-0" />
                        </button>
                        <button type="button" className="button" onClick={handleSidebarToggle}>
                            <HeroIcons.ChevronDoubleLeftIcon className="icon-x20 mr-0" />
                        </button>
                    </div>
                </div>
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
                    <div className="sm:h-24 2xl:h-28 overflow-y-scroll">
                        {Array.isArray(general) && general.map((data, index) => (
                            <Link to={data.url} key={index}
                                className="flex items-center text-default py-2.5 px-4 rounded transition duration-200 hover:bg-default-faded">
                                {data.icon && data.icon()}&nbsp;{data.name}
                            </Link>
                        ))}
                    </div>
                    <hr className="pb-2 mt-2" />
                    <SidebarSpace
                        spaceRef={spaceRef}
                        favoriteSpaceRef={favoriteSpaceRef}
                        projectRef={projectRef}
                        folderRef={folderRef}
                        mySpaceList={mySpaceList}
                        favSpaceList={favSpaceList}
                        fetchMySpaceList={fetchMySpaceList}
                    />
                </nav>
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
                <ContextMenuFavoriteSpace
                    favoriteSpaceRef={favoriteSpaceRef}
                    fetchMySpaceList={fetchMySpaceList}
                    fetchFavSpaceList={fetchFavSpaceList}
                />
                <ContextMenuSpace
                    spaceRef={spaceRef}
                    fetchMySpaceList={fetchMySpaceList}
                    fetchFavSpaceList={fetchFavSpaceList}
                />
                <ContextMenuFolder
                    folderRef={folderRef}
                    fetchSpaceList={fetchMySpaceList}
                />
                <ContextMenuProject
                    projectRef={projectRef}
                    fetchSpaceList={fetchMySpaceList}
                />
            </aside>
            {/* Form Space */}
            <FormNewSpace fetchingData={fetchMySpaceList} />
            <FormEditSpace fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <FormRenameSpace fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <FormChangeColorSpace fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            {/* Form Project */}
            <FormNewProject fetchingData={fetchMySpaceList} />
            <FormRenameProject fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <FormMoveProject fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <FormChangeColorProject fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            {/* Form Folder */}
            <FormNewFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <FormRenameFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <FormOpenFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <FormMoveFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
        </React.Fragment>
    );
};

export default Component;