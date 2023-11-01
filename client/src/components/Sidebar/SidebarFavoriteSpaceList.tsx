import { Disclosure, } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SidebarFolder, SidebarProject } from '.';
import useAuthorize from '../../hooks/useAuthorize';
import { setMouseX, setMouseY, setProjectName, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';
import { Space } from '../../types/Space';

interface Props {
    favoriteSpaceRef: React.MutableRefObject<HTMLButtonElement | null>;
    projectRef: React.MutableRefObject<HTMLButtonElement | null>;
    folderRef: React.MutableRefObject<HTMLButtonElement | null>;
    favSpaceList: Space[];
    fetchMySpaceList: () => Promise<void>;
}

const Component = ({ favoriteSpaceRef, projectRef, folderRef, favSpaceList, fetchMySpaceList }: Props) => {

    useAuthorize();

    const dispatch = useDispatch();

    const handleClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, _space: Space) => {
        dispatch(setProjectName(null));
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, space: Space) => {
        event.preventDefault();
        favoriteSpaceRef.current?.click();
        dispatch(setSpaceId(space.id));
        dispatch(setSpaceUrl(space.url));
        dispatch(setSpaceName(space.name));
        const spaceRect = favoriteSpaceRef.current?.getBoundingClientRect();
        if (spaceRect) {
            dispatch(setMouseX(event.clientX - spaceRect.left));
            dispatch(setMouseY(event.clientY - spaceRect.top));
        }
    };

    return (
        <React.Fragment>
            {favSpaceList.length > 0 ? (
                <div className="mb-1">
                    <span className="text-default uppercase font-bold text-xs mr-2">{'⭐ Favorite'}</span>
                </div>
            ) : null}
            {/* Favorite Space */}
            {favSpaceList.map((data, index) => (
                <Disclosure defaultOpen={data.isOpen} key={index}>
                    {({ open }) => (
                        <React.Fragment>
                            <div className="inline-flex flex-nowrap items-center rounded transition duration-200 py-2.5 hover:bg-default-faded w-full"
                                onContextMenu={(event) => handleContextMenu(event, data)}
                                onClick={(event) => handleClick(event, data)}
                            >
                                <Disclosure.Button>
                                    <HeroIcons.ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} inline-flex icon-x16 text-default ml-1`} />
                                </Disclosure.Button>
                                <Link to={data.id ? `/${data.id}/${data.url}` : ''} className="w-full">
                                    <span
                                        className="w-7 h-7 px-2.5 py-1.5 text-xs rounded text-white mr-2"
                                        style={{ backgroundColor: data.color }}
                                    >
                                        {data.name.toUpperCase().charAt(0)}
                                    </span>
                                    <span className="text-default">
                                        {data.name}
                                    </span>
                                </Link>
                                {data.isPrivate && (
                                    <span>
                                        <HeroIcons.LockClosedIcon className="icon-x16 text-default" />
                                    </span>
                                )}
                            </div>
                            <Disclosure.Panel>
                                <SidebarFolder
                                    space={data}
                                    folderRef={folderRef}
                                    fetchSpaceList={fetchMySpaceList}
                                />
                                <SidebarProject
                                    space={data}
                                    projectRef={projectRef}
                                    fetchSpaceList={fetchMySpaceList}
                                />
                            </Disclosure.Panel>
                        </React.Fragment>
                    )}
                </Disclosure>
            ))
            }
        </React.Fragment >
    );
};

export default Component;