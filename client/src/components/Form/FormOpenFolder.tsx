import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setOpenFormOpenFolder } from '../../redux/Dialog/actions';
import { getOpenFormOpenFolder } from '../../redux/Dialog/selectors';
import { setFolderId, setMouseX, setMouseY, setProjectId, setProjectName, setProjectUrl, setSpaceId, setSpaceName, setSpaceUrl } from '../../redux/Sidebar/actions';
import { getFolderId } from '../../redux/Sidebar/selectors';
import { ContextMenuProject } from '../ContextMenu';
import { Grid } from '../Grid';

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
            const response: AxiosResponse<Folder> = await axios.get(`${SERVER.API.FOLDER}/${folderId!}`);
            setFolder(response.data);
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
            let calculatedMouseX = event.clientX - projectRect.left;
            let calculatedMouseY = event.clientY - projectRect.top;

            calculatedMouseY = Math.min(calculatedMouseY, -300);

            dispatch(setMouseX(calculatedMouseX));
            dispatch(setMouseY(calculatedMouseY));
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
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-xl p-6 text-left align-middle transition-all transform rounded-lg shadow-lg bg-default text-default">
                                    <Dialog.Title
                                        as="h3"
                                        className="mb-2 text-lg font-bold leading-6 text-default"
                                    >
                                        <span className="mr-3">
                                            {'📁'}
                                        </span>
                                        {folder?.name}
                                        <button
                                            type="button"
                                            className="float-right text-default"
                                            onClick={handleClose}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)} className="overflow-y-auto max-h-112">
                                        <Grid column={5} gap={4} className="justify-center">
                                            {Array.isArray(renderProject) && renderProject.map((project, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="inline-block text-default">
                                                        <div
                                                            onContextMenu={(event) => handleContextMenu(event, folder!, project)}
                                                            onClick={(event) => handleClick(event, project)}
                                                            className="items-center justify-center block p-3 align-middle has-tooltip"
                                                        >
                                                            <Link to={project.id && project.url ? `/${folder!.spaceId!}/${folder!.spaceUrl!}/${project.id}/${project.url}` : ''} className="flex items-center p-3 transition duration-200 rounded-lg hover:bg-default-faded">
                                                                <span
                                                                    className="w-12 h-12 px-2.5 py-1.5 text-xl rounded uppercase text-white flex items-center justify-center cursor-pointer"
                                                                    style={{ backgroundColor: project.color }}
                                                                >
                                                                    {project.name.charAt(0)}
                                                                </span>
                                                            </Link>
                                                            <span className="block text-center truncate">{project.name}</span>
                                                            <span className="tooltip rounded px-3 py-1.5 bg-default border border-default text-default whitespace-nowrap">{project.name}</span>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </Grid>
                                        <div className="flex justify-center mt-4">
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
                        fetchFavSpaceList={fetchFavSpaceList}
                    />
                </Dialog>
            </Transition>
        </React.Fragment>
    );
};

export default Component;