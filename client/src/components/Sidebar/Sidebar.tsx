import * as HeroIcons from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { SidebarSpace } from '.';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';
import { setToggle } from '../../redux/Sidebar/actions';
import { getToggle } from '../../redux/Sidebar/selectors';
import { setTheme } from '../../redux/Theme/actions';
import { ContextMenuFolder, ContextMenuProject, ContextMenuSpace } from '../ContextMenu';
import * as Form from '../Form';
import Data from './data';
import useAuthorize from '../../hooks/useAuthorize';

const Component = () => {

    useAuthorize();
    const { general } = Data();
    const { spaceId } = useParams();
    const dispatch = useDispatch();
    const toggle = useSelector(getToggle);

    const [appearance, setAppearance] = React.useState<string>(localStorage.getItem('theme') || '');
    const isDarkMode = appearance === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDarkMode);
    const darkModeRef: React.RefObject<SVGSVGElement> = React.useRef(null);
    const lightModeRef: React.RefObject<SVGSVGElement> = React.useRef(null);

    const spaceRef = React.useRef<HTMLButtonElement | null>(null);
    const projectRef = React.useRef<HTMLButtonElement | null>(null);
    const folderRef = React.useRef<HTMLButtonElement | null>(null);

    const [mySpaceList, setMySpaceList] = React.useState<Space[]>([]);
    const [favSpaceList, setFavSpaceList] = React.useState<Space[]>([]);

    const fetchMySpaceList = async () => {
        try {
            const response: AxiosResponse<Space[]> = await axios.get(`${SERVER.API.SPACE}/all`);
            setMySpaceList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchFavSpaceList = async () => {
        try {
            const response: AxiosResponse<Space[]> = await axios.get(`${SERVER.API.USERPROFILE}/favorite/space`);
            setFavSpaceList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleThemeToggle = () => {
        const isDarkMode = document.documentElement.classList.toggle('dark');
        const newTheme = isDarkMode ? 'dark' : 'light';

        darkModeRef.current?.classList.toggle('hidden', !isDarkMode);
        lightModeRef.current?.classList.toggle('hidden', isDarkMode);

        dispatch(setTheme(newTheme));
        setAppearance(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    React.useEffect(() => {
        const isDarkTheme = localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        lightModeRef.current?.classList.toggle('hidden', !isDarkTheme);
        darkModeRef.current?.classList.toggle('hidden', isDarkTheme);
    }, []);

    React.useEffect(() => {
        void fetchMySpaceList();
        void fetchFavSpaceList();
    }, [spaceId]);

    return (
        <React.Fragment>
            <aside className={`z-10 fixed top-0 left-0 h-screen transition-transform -translate-x-full bg-default w-80 p-2 border-r border-default ${toggle ? '' : 'transform translate-x-0'}`}>
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
                            className="mr-1 button"
                            onClick={handleThemeToggle}
                        >
                            <HeroIcons.SunIcon ref={darkModeRef} className="hidden mr-0 icon-x20" />
                            <HeroIcons.MoonIcon ref={lightModeRef} className="hidden mr-0 icon-x20" />
                        </button>
                        <button type="button" className="button" onClick={() => dispatch(setToggle(!toggle))}>
                            <HeroIcons.ChevronDoubleLeftIcon className="mr-0 icon-x20" />
                        </button>
                    </div>
                </div>
                <hr />
                {/* <div className="relative mb-2">
                    <div className="absolute -inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-default">
                        <HeroIcons.MagnifyingGlassIcon className="icon-x16" />
                    </div>
                    <input
                        type="text"
                        className="text-default bg-default border border-default outline-none rounded-lg block w-full pl-10 p-2.5"
                        placeholder="Search"
                    />
                </div> */}
                <nav>
                    <div className="relative">
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
                        projectRef={projectRef}
                        folderRef={folderRef}
                        mySpaceList={mySpaceList}
                        favSpaceList={favSpaceList}
                        fetchMySpaceList={fetchMySpaceList}
                    />
                </nav>
                <hr className="pb-2" />
                <div className="flex justify-between fixed bottom-0">
                    <div className="mb-2">
                        <Link to="/logout" title="Logout" className="button">
                            <HeroIcons.PowerIcon className="mr-0 icon-x16" />
                        </Link>
                    </div>
                </div>
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
                    fetchFavSpaceList={fetchFavSpaceList}
                />
            </aside>
            {/* Form Space */}
            <Form.FormNewSpace fetchingData={fetchMySpaceList} />
            <Form.FormEditSpace fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <Form.FormRenameSpace fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <Form.FormChangeColorSpace fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            {/* Form Project */}
            <Form.FormNewProject fetchingData={fetchMySpaceList} />
            <Form.FormRenameProject fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <Form.FormMoveProject fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <Form.FormChangeColorProject fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            {/* Form Folder */}
            <Form.FormNewFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <Form.FormRenameFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <Form.FormOpenFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
            <Form.FormMoveFolder fetchMySpaceList={fetchMySpaceList} fetchFavSpaceList={fetchFavSpaceList} />
        </React.Fragment>
    );
};

export default Component;