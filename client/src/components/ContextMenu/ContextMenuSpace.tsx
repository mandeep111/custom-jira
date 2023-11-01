import { Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpenFormChangeColorSpace, setOpenFormEditSpace, setOpenFormNewFolder, setOpenFormNewProject, setOpenFormRenameSpace } from '../../redux/Dialog/actions';
import { setFolderId } from '../../redux/Sidebar/actions';
import { getMouseX, getMouseY, getSpaceId, getSpaceUrl } from '../../redux/Sidebar/selectors';
import Http from '../../services/Http';
import { ContextMenu } from '../../types/ContextMenu';
import { API } from '../../utils/api';

interface Props {
    spaceRef: React.MutableRefObject<HTMLButtonElement | null>;
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ spaceRef, fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const spaceId = useSelector(getSpaceId);
    const spaceUrl = useSelector(getSpaceUrl);
    const mouseX = useSelector(getMouseX);
    const mouseY = useSelector(getMouseY);

    const spaceContextMenu: ContextMenu[] = [
        {
            title: 'Create new', fnc: () => contextCreateRef.current!.click(), icon: () => <HeroIcons.PlusIcon className="icon-x16" />, class: 'text-default', child: [
                {
                    title: 'Project', fnc: () => {
                        dispatch(setFolderId(null));
                        dispatch(setOpenFormNewProject(true));
                    }, icon: () => <HeroIcons.ListBulletIcon className="icon-x16" />, class: 'text-default', child: [], break: false
                },
                { title: 'Folder', fnc: () => dispatch(setOpenFormNewFolder(true)), icon: () => <HeroIcons.FolderIcon className="icon-x16" />, class: 'text-default', child: [], break: false }
            ], break: false
        },
        { title: 'Edit', fnc: () => dispatch(setOpenFormEditSpace(true)), icon: () => <HeroIcons.PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Rename', fnc: () => dispatch(setOpenFormRenameSpace(true)), icon: () => <HeroIcons.PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Color', fnc: () => dispatch(setOpenFormChangeColorSpace(true)), icon: () => <HeroIcons.PaintBrushIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Copy link', fnc: () => handleCopyLink(), icon: () => <HeroIcons.LinkIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Duplicate', fnc: () => void handleDuplicate(), icon: () => <HeroIcons.Square2StackIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Add to favorites', fnc: () => void handleAddFavorite(), icon: () => <HeroIcons.StarIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Delete', fnc: () => void handleDelete(), icon: () => <HeroIcons.TrashIcon className="icon-x16" />, class: 'text-red-400', child: [], break: false },
    ];

    const contextCreateRef = React.useRef<HTMLButtonElement | null>(null);

    const handleAddFavorite = async () => {
        try {
            await Http.create(`${API.SPACE}/favorite/${spaceId!}`, null);
            await fetchFavSpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleCopyLink = () => {
        const urlToCopy = `${window.location.origin}/${spaceId!}/${spaceUrl}`;
        const hiddenInput = document.createElement('input');
        hiddenInput.value = urlToCopy;
        document.body.appendChild(hiddenInput);
        hiddenInput.select();
        document.execCommand('copy');
        document.body.removeChild(hiddenInput);
    };

    const handleDuplicate = async () => {
        try {
            await Http.duplicate(`${API.SPACE}/duplicate/${spaceId!}`);
            await fetchFavSpaceList();
            await fetchMySpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDelete = async () => {
        try {
            await Http.remove(`${API.SPACE}/${spaceId!}`);
            await fetchFavSpaceList();
            await fetchMySpaceList();
            navigate('/no-space');
        } catch (error) {
            throw new Error(error as string);
        }
    };

    return (
        <React.Fragment>
            <div className="text-right">
                <Menu as="span" className="relative inline-block text-left ml-auto">
                    <Menu.Button ref={spaceRef} className="flex items-center" />
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
                                {spaceContextMenu.map((context, index) => (
                                    <React.Fragment key={index}>
                                        <Menu.Item>
                                            {({ close }) => (
                                                <React.Fragment>
                                                    <div
                                                        className={`group ${context.class ? context.class : 'text-default'} text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer`}
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
                                                                <Menu.Button
                                                                    ref={contextCreateRef}
                                                                    className="flex items-center"
                                                                >
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
                                                                    <Menu.Items className="absolute -left-4 top-4 mt-2 w-64 origin-top-left divide-y divide-gray-100 rounded-md bg-default shadow-lg border border-default">
                                                                        <div className="px-1 py-1">
                                                                            {context.child.map((child, index) => (
                                                                                <React.Fragment key={index}>
                                                                                    <Menu.Item>
                                                                                        {() => (
                                                                                            <span
                                                                                                onClick={child.fnc}
                                                                                                className={`group ${child.class ? child.class : 'text-default'} flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded`}
                                                                                            >
                                                                                                {child.icon && child.icon()}
                                                                                                <p className="w-full" onClick={close}>
                                                                                                    {child.title}
                                                                                                </p>
                                                                                            </span>
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
                                                </React.Fragment>
                                            )}
                                        </Menu.Item>
                                        {context.break ? <hr /> : null}
                                    </React.Fragment>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div >
        </React.Fragment >
    );
};

export default Component;