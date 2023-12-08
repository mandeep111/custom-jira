import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUserId } from '../../redux/Authentication/selectors';
import { setOpenFormNewProject } from '../../redux/Dialog/actions';
import { getOpenFormNewProject } from '../../redux/Dialog/selectors';
import { getFolderId, getSpaceId } from '../../redux/Sidebar/selectors';
import { Grid } from '../Grid';
import { PopoverColor } from '../Popover';

interface Props {
    fetchingData: () => Promise<void>;
}

const initialProjectState: Project = {
    id: null,
    spaceId: null,
    userId: null,
    folderId: null,
    stageId: 1,
    name: '',
    color: '#F472B6',
    url: '',
    taskStages: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
    ],
    isPrivate: false
};

const Component = ({ fetchingData }: Props) => {

    const dispatch = useDispatch();
    const userId = useSelector(getUserId);
    const spaceId = useSelector(getSpaceId);
    const folderId = useSelector(getFolderId);
    const isOpen = useSelector(getOpenFormNewProject);

    const [project, setProject] = React.useState<Project>(initialProjectState);

    const handleClose = () => {
        setProject(initialProjectState);
        dispatch(setOpenFormNewProject(false));
    };

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setProject((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const { value } = target;
        const filteredValue = value.replace(/[^0-9a-zA-Zก-๙\s]/g, '').replace(/\s+/g, ' ');
        setProject((prevState) => ({
            ...prevState,
            name: filteredValue
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.post(SERVER.API.PROJECT, project);
            await fetchingData();
        } catch (error) {
            toast.error(error as string);
        } finally {
            handleClose();
        }
    };

    React.useEffect(() => {
        const numberOrLetterPattern = /^[0-9a-zA-Z]+$/;
        const formattedName = project.name.trim().toLowerCase().replace(/\s+/g, '-');
        const thaiPattern = /[\u0E00-\u0E7F]/;
        if (project.name === '') {
            setProject((prevState) => ({
                ...prevState,
                spaceId,
                url: 'your-url'
            }));
           
        } else if (numberOrLetterPattern.test(project.name) && !thaiPattern.test(project.name)) {
            setProject((prevState) => ({
                ...prevState,
                spaceId,
                url: formattedName
            }));
        } else if (project.name.includes(' ')) {
            const parts = project.name.split(' ');
            const url = parts.map(part => part.match(numberOrLetterPattern) ? part : Math.random().toString(36).substr(2, 9)).join('-');
            setProject((prevState) => ({
                ...prevState,
                spaceId,
                url: url.toLowerCase()
            }));
        } else {
            setProject((prevState) => ({
                ...prevState,
                spaceId,
                url: Math.random().toString(36).substr(2, 9)
            }));
        }

    }, [spaceId, project.name]);

    React.useEffect(() => {
        spaceId && setProject((prevState) => ({
            ...prevState,
            spaceId,
            folderId,
            url: project.name.toLowerCase().replace(/\s+/g, '-')
        }));

        userId && setProject((prevState) => ({
            ...prevState,
            userId
        }));

    }, [userId, folderId]);


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
                                <Dialog.Panel className="w-full max-w-xl p-6 overflow-hidden text-left align-middle transition-all transform rounded-lg shadow-lg bg-default text-default">
                                    <Dialog.Title
                                        as="h3"
                                        className="mb-2 text-lg font-bold leading-6 text-default"
                                    >
                                        {'Create new Project'}
                                        <button
                                            type="button"
                                            className="float-right text-default"
                                            onClick={handleClose}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <PopoverColor color={project.color} onClick={handleColorChange} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input
                                                    type="text"
                                                    maxLength={255}
                                                    title="Only alphanumeric characters are allowed."
                                                    value={project.name || ''}
                                                    placeholder="Project name"
                                                    className="flex w-full py-2 text-xl bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={handleNameChange}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <div className="checkbox-group">
                                                    <input
                                                        type="checkbox"
                                                        checked={project.isPrivate}
                                                        onChange={(event) => setProject({ ...project, isPrivate: event.target.checked })}
                                                    />
                                                    <label htmlFor="isPrivate" className="inline-flex ml-1 cursor-pointer label">{'Private'}</label>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <label htmlFor="name" className="label">{'Link :'} {'/' + (project.url || 'your-url')}</label>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="w-full text-white bg-pink-400 button hover:bg-pink-500 focus:bg-pink-500">{'Create'}</button>
                                            </Grid.Column>
                                        </Grid>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </React.Fragment>
    );
};

export default Component;