import { Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import Http from '../../services/Http';
import { ContextMenu } from '../../types/ContextMenu';
import { Project } from '../../types/Project';
import { Space } from '../../types/Space';
import { API } from '../../utils/api';
import { FormNewProject } from '../Form';

interface Props {
    data: SpaceList;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    spaceId: number | null;
    fetchSpaceList: () => Promise<void>;
}

interface SpaceList extends Space {
    tags: string;
    projects: Project[];
    isPrivate: boolean;
    isOpen: boolean;
}

const Component = ({ data, spaceId, isOpen, setIsOpen, fetchSpaceList }: Props) => {

    const listContextMenu: ContextMenu[] = [
        { title: 'Rename', fnc: undefined, icon: () => <HeroIcons.PencilIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Copy link', fnc: () => { handleCopyUrl(); }, icon: () => <HeroIcons.LinkIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Duplicate', fnc: () => void handleDubplicate(), icon: () => <HeroIcons.Square2StackIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Move', fnc: undefined, icon: () => <HeroIcons.ArrowRightOnRectangleIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Add to favorites', fnc: undefined, icon: () => <HeroIcons.StarIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Project Info', fnc: undefined, icon: () => <HeroIcons.InformationCircleIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Project settings', fnc: undefined, icon: () => <HeroIcons.Cog8ToothIcon className="icon-x16" />, class: 'text-default', child: [], break: true },
        { title: 'Archive', fnc: undefined, icon: () => <HeroIcons.ArchiveBoxIcon className="icon-x16" />, class: 'text-default', child: [], break: false },
        { title: 'Delete', fnc: () => void handleDelete(), icon: () => <HeroIcons.TrashIcon className="icon-x16" />, class: 'text-red-400', child: [], break: false },
    ];

    const projectRef = React.useRef<HTMLButtonElement | null>(null);
    const projectUrlRef = React.useRef<HTMLAnchorElement | null>(null);
    const [mouseX, setMouseX] = React.useState<number>(0);
    const [mouseY, setMouseY] = React.useState<number>(0);

    const [openFormNewProject, setOpenFormNewProject] = React.useState<boolean>(false);
    const [projectId, setProjectId] = React.useState<number | null>(null);

    const handleCopyUrl = () => {
        console.log(projectUrlRef.current?.href);
    };

    const handleDubplicate = async () => {
        try {
            await Http.duplicate(`${API.PROJECT}/duplicate/${projectId!}`, null,);
            await fetchSpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDelete = async () => {
        try {
            await Http.remove(`${API.PROJECT}/${projectId!}`);
            await fetchSpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        setOpenFormNewProject(isOpen);
    }, [isOpen]);

    React.useEffect(() => {
        setIsOpen(openFormNewProject);
    }, [openFormNewProject]);

    return (
        <React.Fragment>
            {Array.isArray(data.projects) && data.projects.map((project, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center text-default py-2.5 rounded transition duration-200 hover:bg-default-faded"
                        onContextMenu={(event) => {
                            event.preventDefault();
                            projectRef.current?.click();
                            setProjectId(project.id);
                            const projectRect = projectRef.current?.getBoundingClientRect();
                            if (projectRect) {
                                setMouseX(event.clientX - projectRect.left);
                                setMouseY(event.clientY - projectRect.top);
                            }
                        }}
                    >
                        <Link ref={projectUrlRef} to={project.id && project.url ? `/${data.id!}/${data.url}/${project.id}/${project.url}` : ''} className="flex items-center ml-10 w-full">
                            <div className="flex items-center">
                                <span className="rounded-full p-1.5 w-0 mr-2" style={{ backgroundColor: project.color }}></span>
                                <span className="text-default">
                                    {project.name}
                                </span>
                            </div>
                        </Link>
                        <div className="text-right">
                            <Menu as="div" className="relative inline-block text-left ml-auto z-50">
                                <div>
                                    <Menu.Button ref={el => { console.log(el); projectRef.current = el; }} className="flex items-center">
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
                                    <Menu.Items className="absolute mt-2 w-64 origin-top-left divide-y divide-gray-100 rounded-md bg-default shadow-lg border border-default" style={{ top: mouseY, left: mouseX }}>
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
                        <div className="relative inline-block text-left ml-auto">
                            <div className="flex items-center pr-3">
                                {data.projects.map((project) => (
                                    project.tasks.length
                                ))}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            ))}
            {/* Form Create Project */}
            <FormNewProject isOpen={openFormNewProject} setIsOpen={setOpenFormNewProject} fetchingData={fetchSpaceList} spaceId={spaceId} />
        </React.Fragment>
    );
};

export default Component;