import { Disclosure } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SidebarFolder, SidebarProject } from '.';
import { setFavoriteSpace, setMouseX, setMouseY, setProjectName, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';
import { Alert } from '../Alert';

interface Props {
    spaceRef: React.MutableRefObject<HTMLButtonElement | null>;
    projectRef: React.MutableRefObject<HTMLButtonElement | null>;
    folderRef: React.MutableRefObject<HTMLButtonElement | null>;
    mySpaceList: Space[];
    fetchMySpaceList: () => Promise<void>;
}

const Component = ({ spaceRef, projectRef, folderRef, mySpaceList, fetchMySpaceList }: Props) => {

    const dispatch = useDispatch();

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, space: Space) => {
        event.preventDefault();
        spaceRef.current?.click();
        dispatch(setSpaceId(space.id));
        dispatch(setSpaceUrl(space.url));
        dispatch(setSpaceName(space.name));
        dispatch(setFavoriteSpace(space.isFavorite!));
        const spaceRect = spaceRef.current?.getBoundingClientRect();
        if (spaceRect) {
            let calculatedMouseX = event.clientX - spaceRect.left;
            let calculatedMouseY = event.clientY - spaceRect.top;

            calculatedMouseY = Math.min(calculatedMouseY, -350);

            dispatch(setMouseX(calculatedMouseX));
            dispatch(setMouseY(calculatedMouseY));
        }
    };

    return (
        <React.Fragment>
            {mySpaceList.length > 0 ? (
                <React.Fragment>
                    <div className="mb-1">
                        <span className="mr-2 text-xs font-bold uppercase text-default">{'🏳️ My Space'}</span>
                    </div>
                    <div className="overflow-y-scroll sm:max-h-[108px] 2xl:max-h-[240px]">
                        {mySpaceList.map((data, index) => (
                            <Disclosure defaultOpen={data.isOpen} key={index}>
                                {({ open }) => (
                                    <React.Fragment>
                                        <div className="inline-flex flex-nowrap items-center rounded transition duration-200 py-2.5 hover:bg-default-faded w-full"
                                            onContextMenu={(event) => handleContextMenu(event, data)}
                                            onClick={() => {
                                                dispatch(setProjectName(null));
                                                dispatch(setSpaceId(data.id));
                                            }}
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
                        ))}
                    </div>
                </React.Fragment>
            ) : <Alert icon={<HeroIcons.InformationCircleIcon className="icon-x20" />} message={'No Space. 🚀'} className="!mx-0 border bg-default-faded border-default text-default" />}
        </React.Fragment>
    );
};

export default Component;