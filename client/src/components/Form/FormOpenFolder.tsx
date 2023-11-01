import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setOpenFormOpenFolder } from '../../redux/Dialog/actions';
import { getOpenFormOpenFolder } from '../../redux/Dialog/selectors';
import { setFolderId, setMouseX, setMouseY, setProjectId, setProjectName, setProjectUrl, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';
import { getFolderId } from '../../redux/Sidebar/selectors';
import Http from '../../services/Http';
import { API } from '../../utils/api';
import { ContextMenuProject } from '../ContextMenu';
import { Grid } from '../Grid';
import { Folder } from '../../types/Folder';
import { Project } from '../../types/Project';

interface Props {
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const dispatch = useDispatch();
    const folderId = useSelector(getFolderId);
    const isOpen = useSelector(getOpenFormOpenFolder);
    const projectRef = React.useRef<HTMLButtonElement | null>(null);

    const [folder, setFolder] = React.useState<Folder>();

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 15;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const renderProject = folder?.project?.slice(startIndex, endIndex);
    const totalPages = folder && folder.project ? Math.ceil(folder.project.length / itemsPerPage) : 0;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const fetchFolder = async () => {
        try {
            const response: Folder = await Http.get(`${API.FOLDER}/${folderId!}`);
            setFolder(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleClose = () => {
        dispatch(setOpenFormOpenFolder(false));
        dispatch(setFolderId(null));
    };

    const handleClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, project: Project) => {
        dispatch(setProjectName(project.name));
        handleClose();
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, folder: Folder, project: Project) => {
        event.preventDefault();
        projectRef.current?.click();
        dispatch(setSpaceId(folder.spaceId));
        dispatch(setSpaceName(folder.spaceName!));
        dispatch(setSpaceUrl(folder.spaceUrl!));
        dispatch(setProjectId(project.id));
        dispatch(setProjectUrl(project.url));
        dispatch(setProjectName(project.name));
        const projectRect = projectRef.current?.getBoundingClientRect();
        if (projectRect) {
            dispatch(setMouseX(event.clientX - projectRect.left));
            dispatch(setMouseY(event.clientY - projectRect.top));
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            dispatch(setOpenFormOpenFolder(false));
            await fetchMySpaceList();
            await fetchFavSpaceList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    React.useEffect(() => {
        if (folderId) {
            void fetchFolder();
        }
        setCurrentPage(1);
    }, [folderId, isOpen]);

    React.useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                nextPage();
            } else if (e.deltaY < 0) {
                prevPage();
            }
        };
        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [currentPage, isOpen, folderId]);

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleClose}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="backdrop" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full transform rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default max-w-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 text-default mb-2 font-bold"
                                    >
                                        <span className="mr-3">
                                            {'📁'}
                                        </span>
                                        {folder?.name}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={handleClose}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)} className="max-h-112 overflow-y-auto">
                                        <Grid column={5} gap={4} className="justify-center">
                                            {Array.isArray(renderProject) && renderProject.map((project, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="inline-block text-default">
                                                        <div
                                                            onContextMenu={(event) => handleContextMenu(event, folder!, project)}
                                                            onClick={(event) => handleClick(event, project)}
                                                            className="has-tooltip p-3 block justify-center items-center align-middle"
                                                        >
                                                            <Link to={project.id && project.url ? `/${folder!.spaceId!}/${folder!.spaceUrl!}/${project.id}/${project.url}` : ''} className="flex items-center transition duration-200 p-3 rounded-lg hover:bg-default-faded">
                                                                <span
                                                                    className="w-12 h-12 px-2.5 py-1.5 text-xl rounded uppercase text-white flex items-center justify-center cursor-pointer"
                                                                    style={{ backgroundColor: project.color }}
                                                                >
                                                                    {project.name.charAt(0)}
                                                                </span>
                                                            </Link>
                                                            <span className="block truncate text-center">{project.name}</span>
                                                            <span className="tooltip rounded px-3 py-1.5 bg-default border border-default text-default whitespace-nowrap">{project.name}</span>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </Grid>
                                        <div className="mt-4 flex justify-center">
                                            {pageNumbers.map((page) => (
                                                <button
                                                    type="button"
                                                    key={page}
                                                    className={`flex w-3 h-3 rounded-full m-1.5 ${page === currentPage ? 'bg-zinc-600 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-500'}`}
                                                    onClick={() => handlePageChange(page)}
                                                />
                                            ))}
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                    <ContextMenuProject
                        projectRef={projectRef}
                        fetchSpaceList={fetchMySpaceList}
                    />
                </Dialog>
            </Transition>
        </React.Fragment>
    );
};

export default Component;