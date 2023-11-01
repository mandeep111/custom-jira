import { Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpenFormMoveFolder, setOpenFormNewProject, setOpenFormRenameFolder } from '../../redux/Dialog/actions';
import { getFolderId, getMouseX, getMouseY, getSpaceId, getSpaceUrl } from '../../redux/Sidebar/selectors';
import Http from '../../services/Http';
import { ContextMenu } from '../../types/ContextMenu';
import { API } from '../../utils/api';
import { getOpenFormOpenFolder } from '../../redux/Dialog/selectors';
import { setFolderId } from '../../redux/Sidebar/actions';

interface Props {
    folderRef: React.MutableRefObject<HTMLButtonElement | null>;
    fetchSpaceList: () => Promise<void>;
}

const Component = ({ folderRef, fetchSpaceList }: Props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const spaceId = useSelector(getSpaceId);
    const spaceUrl = useSelector(getSpaceUrl);
    const folderId = useSelector(getFolderId);
    const isOpen = useSelector(getOpenFormOpenFolder);
    const mouseX = useSelector(getMouseX);
    const mouseY = useSelector(getMouseY);

    const contextMenu: ContextMenu[] = [
        { title: 'Create new Project', fnc: () => dispatch(setOpenFormNewProject(true)), icon: () => <HeroIcons.PlusIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Rename', fnc: () => dispatch(setOpenFormRenameFolder(true)), icon: () => <HeroIcons.PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Move', fnc: () => dispatch(setOpenFormMoveFolder(true)), icon: () => <HeroIcons.ArrowRightOnRectangleIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Delete', fnc: () => void handleDelete(), icon: () => <HeroIcons.TrashIcon className="icon-x16" />, class: 'text-red-400', child: [], break: false },
    ];

    const handleDelete = async () => {
        await fetchSpaceList();
        try {
            await Http.remove(`${API.FOLDER}/${folderId!}`);
            await fetchSpaceList();
            navigate('/no-space');
        } catch (error) {
            throw new Error(error as string);
        }
    };

    return (
        <React.Fragment>
            <div className="text-right">
                <Menu as="div" className="relative inline-block text-left ml-auto z-50">
                    <div>
                        <Menu.Button ref={folderRef} className="flex items-center">
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
                        <Menu.Items className="absolute mt-2 w-64 origin-top-left divide-y divide-gray-100 rounded-md bg-default shadow-lg border border-default" style={{ top: mouseY!, left: mouseX! }}>
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
                                                        <Menu as="div" className="relative inline-block text-left ml-auto">
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
                                                                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-default shadow-lg">
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