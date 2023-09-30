import React from 'react';
import Data from './data';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArchiveBoxIcon,
    ArrowRightOnRectangleIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    Cog8ToothIcon,
    DocumentIcon,
    EllipsisHorizontalIcon,
    FolderIcon,
    InformationCircleIcon,
    LinkIcon,
    ListBulletIcon,
    MagnifyingGlassIcon,
    PaintBrushIcon,
    PencilIcon,
    PlusIcon,
    PowerIcon,
    Square2StackIcon,
    StarIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { InformationCircleIcon as InformationCircleIconSolid } from '@heroicons/react/24/solid';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { getAll } from '../../services/Sapce';
import { Logo } from '../Logo';
import { FormNewProject, FormNewSpace } from '../Form';

interface ContextMenu {
    title: string;
    fnc?: () => void;
    icon: () => JSX.Element;
    class: string;
    child: {
        title: string;
        fnc?: () => void;
        icon: () => JSX.Element;
        class: string;
        child: unknown[];
        break: boolean;
    }[];
    break: boolean;
}

interface SpaceList {
    id: number | null;
    name: string;
    tags: string;
    color: string;
    url: string;
    projects: Project[];
    isPrivate: boolean;
    isOpen: boolean;
}

interface Project {
    id: number | null;
    spaceId: number | null;
    stageId: number | null;
    name: string;
    color: string;
    url: string;
    taskStages: TaskStage[];
    isPrivate: boolean;
    isActive: boolean;
}

interface TaskStage {
    id: number | null;
    name?: string;
}

const Component = () => {

    const { general } = Data();
    const navigate = useNavigate();
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [isHoveredSpace, setIsHoveredSpace] = React.useState<number | null>(null);
    const [isHoveredProject, setIsHoveredProject] = React.useState<number | null>(null);
    const [dialogNewSpaceOpen, setDialogNewSpaceOpen] = React.useState(false);
    const [dialogNewProjectOpen, setDialogNewProjectOpen] = React.useState(false);

    const spaceContextMenu: ContextMenu[] = [
        {
            title: 'Create new', fnc: undefined, icon: () => <PlusIcon className="icon-x16" />, class: 'text-default', child: [
                {
                    title: 'Project', fnc: () => {
                        setDialogNewProjectOpen(true);
                        setIsHoveredSpace(null);
                    }, icon: () => <ListBulletIcon className="icon-x16" />, class: 'text-default', child: [], break: true
                },
                { title: 'Folder', fnc: undefined, icon: () => <FolderIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
                { title: 'Doc', fnc: undefined, icon: () => <DocumentIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
            ], break: false
        },
        { title: 'Rename', fnc: () => navigate('/88'), icon: () => <PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Color', fnc: undefined, icon: () => <PaintBrushIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Copy link', fnc: undefined, icon: () => <LinkIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Duplicate', fnc: undefined, icon: () => <Square2StackIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Add to favorites', fnc: undefined, icon: () => <StarIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'More settings', fnc: undefined, icon: () => <Cog8ToothIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Archive', fnc: undefined, icon: () => <ArchiveBoxIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Delete', fnc: undefined, icon: () => <TrashIcon className="icon-x16" />, class: 'text-red-400', child: [], break: false },
    ];

    const listContextMenu: ContextMenu[] = [
        { title: 'Rename', fnc: undefined, icon: () => <PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Copy link', fnc: undefined, icon: () => <LinkIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Duplicate', fnc: undefined, icon: () => <Square2StackIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Move', fnc: undefined, icon: () => <ArrowRightOnRectangleIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Add to favorites', fnc: undefined, icon: () => <StarIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Project Info', fnc: undefined, icon: () => <InformationCircleIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Project settings', fnc: undefined, icon: () => <Cog8ToothIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Archive', fnc: undefined, icon: () => <ArchiveBoxIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Delete', fnc: undefined, icon: () => <TrashIcon className="icon-x16" />, class: 'text-red-400', child: [], break: false },
    ];

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

    const fetchSpaceList = async () => {
        try {
            const response: SpaceList[] = await getAll(config);
            setSpace(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        if (token) {
            void fetchSpaceList();
        }
    }, [token]);

    return (
        <React.Fragment>
            <aside className="flex flex-col max-sm:hidden bg-default w-80 p-2 min-h-screen max-h-screen border border-l border-default">
                <Logo />
                <div className="relative mb-2">
                    <div className="absolute -inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-default">
                        <MagnifyingGlassIcon className="icon-x16" />
                    </div>
                    <input
                        type="text"
                        className="text-default bg-default border border-default outline-none rounded-lg block w-full pl-10 p-2.5"
                        placeholder="Search"
                    />
                </div>
                <nav>
                    {/* General */}
                    {general.map((data, index) => (
                        <Link to={data.url} key={index}
                            className="flex items-center text-default py-2.5 px-4 rounded transition duration-200 hover:bg-default-faded">
                            {data.icon && data.icon()}&nbsp;{data.name}
                        </Link>
                    ))}
                    <hr className="pb-2 mt-2" />
                    <div className="mb-2">
                        <span className="text-default uppercase font-bold text-xs mr-2">{'Space'}</span>
                    </div>
                    <button
                        type="button"
                        className="button w-full mb-2"
                        onClick={() => setDialogNewSpaceOpen(true)}
                    >
                        <PlusIcon className="icon-x16" />
                        <span>{'New Space'}</span>
                    </button>
                    {/* Space */}
                    {space.length !== 0 ? (
                        <React.Fragment>
                            <div className="">
                                {space.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <Disclosure defaultOpen={data.isOpen}>
                                            {({ open }) => (
                                                <React.Fragment>
                                                    <div className="inline-flex flex-nowrap items-center rounded transition duration-200 py-2.5 hover:bg-default-faded w-full"
                                                        onMouseEnter={() => setIsHoveredSpace(index)}
                                                    // onMouseLeave={() => setIsHoveredSpace(null)}
                                                    >
                                                        <Disclosure.Button>
                                                            <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} ${isHoveredSpace !== index ? 'invisible' : ''} inline-flex icon-x16 text-default ml-1`} />
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
                                                        {isHoveredSpace === index ? (
                                                            <Menu as="div" className="relative inline-block text-left ml-auto z-50">
                                                                <Menu.Button className="flex items-center" onClick={() => setSpaceId(data.id)}>
                                                                    <EllipsisHorizontalIcon className="icon-x20 text-default" />
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
                                                                            {spaceContextMenu.map((context, index) => (
                                                                                <React.Fragment key={index}>
                                                                                    <Menu.Item>
                                                                                        {() => (
                                                                                            <React.Fragment>
                                                                                                <div
                                                                                                    className={`group ${context.class ? context.class : 'text-default'} flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer`}
                                                                                                    onClick={context.fnc}
                                                                                                >
                                                                                                    {context.icon && context.icon()}
                                                                                                    {context.title}
                                                                                                    {context.child && context.child.length > 0 ? (
                                                                                                        <Menu as="div" className="relative inline-block text-left ml-auto">
                                                                                                            <Menu.Button className="flex items-center">
                                                                                                                <ChevronRightIcon className="icon-x16" />
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
                                                                                                                                            {child.title}
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
                                                        ) : null}
                                                    </div>
                                                    <Disclosure.Panel>
                                                        {data.projects && data.projects.length > 0 && (
                                                            <React.Fragment>
                                                                {data.projects.map((project, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <div className="flex items-center text-default py-2.5 rounded transition duration-200 hover:bg-default-faded"
                                                                            onMouseEnter={() => setIsHoveredProject(index)}
                                                                        // onMouseLeave={() => setIsHoveredProject(null)}
                                                                        >
                                                                            <Link to={project.id && project.url ? `/${data.id!}/${data.url}/${project.id}/${project.url}` : ''} className="flex items-center ml-10 w-full">
                                                                                <div className="flex items-center">
                                                                                    <span className="rounded-full p-1.5 w-0 mr-2" style={{ backgroundColor: project.color }}></span>
                                                                                    <span className="text-default">
                                                                                        {project.name}
                                                                                    </span>
                                                                                </div>
                                                                            </Link>
                                                                            {isHoveredProject === index ? (
                                                                                <Menu as="div" className="relative inline-block text-left ml-auto z-50">
                                                                                    <div>
                                                                                        <Menu.Button className="flex items-center">
                                                                                            <EllipsisHorizontalIcon className="icon-x20" />
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
                                                                                        <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-default shadow-lg">
                                                                                            <div className="px-1 py-1">
                                                                                                {listContextMenu.map((context, index) => (
                                                                                                    <React.Fragment key={index}>
                                                                                                        <Menu.Item>
                                                                                                            {() => (
                                                                                                                <div
                                                                                                                    className={`group ${context.class ? context.class : 'text-default'} flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer`}
                                                                                                                    onClick={context.fnc}
                                                                                                                >
                                                                                                                    {context.icon && context.icon()}
                                                                                                                    {context.title}
                                                                                                                    {context.child && context.child.length > 0 ? (
                                                                                                                        <Menu as="div" className="relative inline-block text-left ml-auto">
                                                                                                                            <Menu.Button className="flex items-center">
                                                                                                                                <ChevronRightIcon className="icon-x16" />
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
                                                                            ) : (
                                                                                <div className="relative inline-block text-left ml-auto">
                                                                                    <div className="flex items-center pr-3">
                                                                                        {'2'}
                                                                                    </div>
                                                                                </div>)
                                                                            }
                                                                        </div>
                                                                    </React.Fragment>
                                                                ))}
                                                            </React.Fragment>
                                                        )}
                                                    </Disclosure.Panel>
                                                </React.Fragment>
                                            )}
                                        </Disclosure>
                                    </React.Fragment>
                                ))}
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className="flex items-center p-4 text-sm text-default rounded-lg bg-default-faded border border-default" role="alert">
                                <InformationCircleIconSolid className="icon-x20 mr-2" />
                                <div>
                                    {'No space.'}
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </nav>
                <div className="block mt-auto">
                    <hr className="pb-2" />
                    <button type="button" className="button">
                        <UserPlusIcon className="icon-x16" />
                        <span>{'Invite'}</span>
                    </button>
                    <Link to="/logout"
                        title="Logout"
                        className="button float-right"
                    >
                        <PowerIcon className="icon-x16 mr-0" />
                    </Link>
                </div>
            </aside>
            {/* Form Create Space */}
            <FormNewSpace isOpen={dialogNewSpaceOpen} setIsOpen={setDialogNewSpaceOpen} fetchingData={fetchSpaceList} />
            {/* Form Create Project */}
            <FormNewProject isOpen={dialogNewProjectOpen} setIsOpen={setDialogNewProjectOpen} fetchingData={fetchSpaceList} spaceId={spaceId} />
        </React.Fragment>
    );
};

export default Component;