import { Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpenFormChangeColorProject, setOpenFormMoveProject, setOpenFormRenameProject } from '../../redux/Dialog/actions';
import { getFavoriteProject, getMouseX, getMouseY, getProjectId, getProjectUrl, getSpaceId, getSpaceUrl } from '../../redux/Sidebar/selectors';

interface Props {
    projectRef: React.MutableRefObject<HTMLButtonElement | null>;
    fetchSpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ projectRef, fetchSpaceList, fetchFavSpaceList }: Props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const spaceId = useSelector(getSpaceId);
    const spaceUrl = useSelector(getSpaceUrl);
    const projectId = useSelector(getProjectId);
    const projectUrl = useSelector(getProjectUrl);
    const projectFav = useSelector(getFavoriteProject);
    const mouseX = useSelector(getMouseX);
    const mouseY = useSelector(getMouseY);

    const contextMenu: ContextMenu[] = [
        { title: 'Rename', fnc: () => dispatch(setOpenFormRenameProject(true)), icon: () => <HeroIcons.PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Color', fnc: () => dispatch(setOpenFormChangeColorProject(true)), icon: () => <HeroIcons.PaintBrushIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Copy link', fnc: () => handleCopyLink(), icon: () => <HeroIcons.LinkIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Duplicate', fnc: () => void handleDuplicate(), icon: () => <HeroIcons.Square2StackIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: projectFav ? 'Unfavorite' : 'Add to favorites', fnc: () => projectFav ? void handleRemoveFavorite() : void handleAddFavorite(), icon: () => projectFav ? <StarIcon className="text-yellow-400 icon-x16" /> : <HeroIcons.StarIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Move', fnc: () => dispatch(setOpenFormMoveProject(true)), icon: () => <HeroIcons.ArrowRightOnRectangleIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Delete', fnc: () => void handleDelete(), icon: () => <HeroIcons.TrashIcon className="icon-x16" />, class: 'text-red-400', child: [], break: false },
    ];

    const handleCopyLink = () => {
        const urlToCopy = `${window.location.origin}/${spaceId!}/${spaceUrl}/${projectId!}/${projectUrl}`;
        const hiddenInput = document.createElement('input');
        hiddenInput.value = urlToCopy;
        document.body.appendChild(hiddenInput);
        hiddenInput.select();
        document.execCommand('copy');
        document.body.removeChild(hiddenInput);
    };

    const handleAddFavorite = async () => {
        try {
            await axios.post(`${SERVER.API.PROJECT}/favorite/${projectId!}`);
            await fetchSpaceList();
            await fetchFavSpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleRemoveFavorite = async () => {
        try {
            await axios.delete(`${SERVER.API.PROJECT}/favorite/${projectId!}`);
            await fetchSpaceList();
            await fetchFavSpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDuplicate = async () => {
        try {
            await axios.post(`${SERVER.API.PROJECT}/duplicate/${projectId!}`, null,);
            await fetchSpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${SERVER.API.PROJECT}/${projectId!}`);
            await fetchSpaceList();
            navigate('/no-space');
        } catch (error) {
            throw new Error(error as string);
        }
    };

    return (
        <React.Fragment>
            <div className="text-right">
                <Menu as="div" className="relative z-50 inline-block ml-auto text-left">
                    <div>
                        <Menu.Button ref={projectRef} className="flex items-center">
                            {null}
                        </Menu.Button>
                    </div>
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute w-64 mt-2 origin-top-left border divide-y divide-gray-100 rounded-md shadow-lg bg-default border-default" style={{ top: mouseY!, left: mouseX! }}>
                            <div className="px-1 py-1">
                                {contextMenu.map((context, index) => (
                                    <React.Fragment key={index}>
                                        <Menu.Item>
                                            {({ close }) => (
                                                <div
                                                    className={`group ${context.class ? context.class : 'text-default'} flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer`}
                                                    onClick={() => {
                                                        context?.fnc?.();
                                                        if (context?.child.length === 0) {
                                                            close();
                                                        }
                                                    }}
                                                >
                                                    {context.icon && context.icon()}
                                                    {context.title}
                                                    {context.child && context.child.length > 0 ? (
                                                        <Menu as="div" className="relative inline-block ml-auto text-left">
                                                            <Menu.Button className="flex items-center">
                                                                <HeroIcons.ChevronRightIcon className="icon-x16" />
                                                            </Menu.Button>
                                                            <Transition
                                                                as={React.Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-left divide-y divide-gray-100 rounded-md shadow-lg bg-default">
                                                                    <div className="px-1 py-1">
                                                                        {context.child.map((child, index) => (
                                                                            <React.Fragment key={index}>
                                                                                <Menu.Item>
                                                                                    {() => (
                                                                                        <div
                                                                                            className={`group ${child.class ? child.class : 'text-default'} flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer`}
                                                                                            onClick={child.fnc}
                                                                                        >
                                                                                            {child.icon && child.icon()}
                                                                                            {child.title}
                                                                                        </div>
                                                                                    )}
                                                                                </Menu.Item>
                                                                                {child.break ? <hr /> : null}
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </div>
                                                                </Menu.Items>
                                                            </Transition>
                                                        </Menu>
                                                    ) : null}
                                                </div>
                                            )}
                                        </Menu.Item>
                                        {context.break ? <hr /> : null}
                                    </React.Fragment>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </React.Fragment>
    );
};

export default Component;