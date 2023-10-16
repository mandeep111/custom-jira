import { Disclosure, Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import { SideabrProject } from '.';
import useAuthorize from '../../hooks/useAuthorize';
import Http from '../../services/Http';
import { ContextMenu } from '../../types/ContextMenu';
import { Project } from '../../types/Project';
import { Space } from '../../types/Space';
import { API } from '../../utils/api';
import { FormNewSpace } from '../Form';

interface SpaceList extends Space {
    tags: string;
    projects: Project[];
    isPrivate: boolean;
    isOpen: boolean;
}

const Component = () => {

    useAuthorize();

    const spaceContextMenu: ContextMenu[] = [
        {
            title: 'Create new', fnc: () => contextCreateRef.current!.click(), icon: () => <HeroIcons.PlusIcon className="icon-x16" />, class: 'text-default', child: [
                {
                    title: 'Project', fnc: () => setOpenFormNewProject(true), icon: () => <HeroIcons.ListBulletIcon className="icon-x16" />, class: 'text-default', child: [], break: true
                },
                { title: 'Folder', fnc: undefined, icon: () => <HeroIcons.FolderIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
                { title: 'Doc', fnc: undefined, icon: () => <HeroIcons.DocumentIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
            ], break: false
        },
        { title: 'Rename', fnc: () => null, icon: () => <HeroIcons.PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Color', fnc: undefined, icon: () => <HeroIcons.PaintBrushIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Copy link', fnc: undefined, icon: () => <HeroIcons.LinkIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Duplicate', fnc: undefined, icon: () => <HeroIcons.Square2StackIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Add to favorites', fnc: undefined, icon: () => <HeroIcons.StarIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'More settings', fnc: undefined, icon: () => <HeroIcons.Cog8ToothIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Archive', fnc: undefined, icon: () => <HeroIcons.ArchiveBoxIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Delete', fnc: undefined, icon: () => <HeroIcons.TrashIcon className="icon-x16" />, class: 'text-red-400', child: [], break: false },
    ];

    const [openFormNewSpace, setOpenFormNewSpace] = React.useState<boolean>(false);
    const [openFormNewProject, setOpenFormNewProject] = React.useState<boolean>(false);

    const spaceRef = React.useRef<HTMLButtonElement | null>(null);
    const contextCreateRef = React.useRef<HTMLButtonElement | null>(null);
    const [mouseX, setMouseX] = React.useState<number>(0);
    const [mouseY, setMouseY] = React.useState<number>(0);

    const [spaceId, setSpaceId] = React.useState<number | null>(null);
    const [space, setSpace] = React.useState<SpaceList[]>([{
        id: null,
        name: '',
        tags: '',
        color: '#94a3b8',
        url: '',
        projects: [],
        isPrivate: false,
        isOpen: true
    }]);

    const fetchData = async () => {
        try {
            const response: SpaceList[] = await Http.getAll(`${API.SPACE}/all`);
            setSpace(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        void fetchData();
    }, []);

    return (
        <React.Fragment>
            {/* Space */}
            {space.length !== 0 ? (
                <React.Fragment>
                    <div className="mb-2">
                        <span className="text-default uppercase font-bold text-xs mr-2">{'Space'}</span>
                    </div>
                    <button
                        type="button"
                        className="button w-full mb-2"
                        onClick={() => setOpenFormNewSpace(true)}
                    >
                        <HeroIcons.PlusIcon className="icon-x16" />
                        <span>{'New Space'}</span>
                    </button>
                    <Link className="w-full flex items-center hover:bg-default-faded rounded transition duration-200 py-2.5 px-7" to="/everything">
                        <div className="inline-flex flex-nowrap items-center">
                            <span className="w-7 h-7 pl-1 py-1 text-xs rounded text-white bg-pink-500">
                                <HeroIcons.Squares2X2Icon className="icon-x20" />
                            </span>
                            <span className="text-default ml-1">
                                {'Everything'}
                            </span>
                        </div>
                    </Link>
                    {space.map((data, index) => (
                        <Disclosure defaultOpen={data.isOpen} key={index}>
                            {({ open }) => (
                                <React.Fragment>
                                    <div className="inline-flex flex-nowrap items-center rounded transition duration-200 py-2.5 hover:bg-default-faded w-full"
                                        onContextMenu={(event) => {
                                            event.preventDefault();
                                            spaceRef.current?.click();
                                            setSpaceId(data.id);
                                            const spaceRect = spaceRef.current?.getBoundingClientRect();
                                            if (spaceRect) {
                                                setMouseX(event.clientX - spaceRect.left);
                                                setMouseY(event.clientY - spaceRect.top);
                                            }
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
                                        <div className="text-right">
                                            <Menu as="div" className="relative inline-block text-left ml-auto z-50">
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
                                                    <Menu.Items className="absolute mt-2 w-64 origin-top-left divide-y divide-gray-100 rounded-md bg-default shadow-lg border border-default" style={{ top: mouseY, left: mouseX }}>
                                                        <div className="px-1 py-1">
                                                            {spaceContextMenu.map((context, index) => (
                                                                <React.Fragment key={index}>
                                                                    <Menu.Item>
                                                                        {({ close }) => (
                                                                            <React.Fragment>
                                                                                <div
                                                                                    className="group text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer"
                                                                                    onClick={context.fnc}
                                                                                >
                                                                                    {context.icon && context.icon()}
                                                                                    {context.title}
                                                                                    {context.child && context.child.length > 0 ? (
                                                                                        <Menu as="div" className="relative inline-block text-left ml-auto">
                                                                                            <Menu.Button ref={contextCreateRef} className="flex items-center">
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
                                        </div>
                                    </div>
                                    <Disclosure.Panel>
                                        {data.projects && data.projects.length > 0 && (
                                            <SideabrProject
                                                data={data}
                                                spaceId={spaceId}
                                                isOpen={openFormNewProject}
                                                setIsOpen={setOpenFormNewProject}
                                                fetchSpaceList={fetchData}
                                            />
                                        )}
                                    </Disclosure.Panel>
                                </React.Fragment>
                            )}
                        </Disclosure>
                    ))}
                </React.Fragment >
            ) : null}
            {/* Form Create Space */}
            <FormNewSpace isOpen={openFormNewSpace} setIsOpen={setOpenFormNewSpace} fetchingData={fetchData} />
        </React.Fragment >
    );
};

export default Component;