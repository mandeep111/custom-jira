import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormMoveProject } from '../../redux/Dialog/actions';
import { getOpenFormMoveProject } from '../../redux/Dialog/selectors';
import { getProjectId } from '../../redux/Sidebar/selectors';
import { Grid } from '../Grid';
import { ListboxFolder, ListboxSpace } from '../Listbox';

interface Props {
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormMoveProject);
    const projectId = useSelector(getProjectId);
    const [selectedSpace, setSelectedSpace] = React.useState<Space | null>(null);
    const [selectedFolder, setSelectedFolder] = React.useState<Folder | null>(null);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (selectedSpace) {
                if (selectedFolder) {
                    await axios.patch(`${SERVER.API.PROJECT}/move-to-folder/${projectId!}/${selectedFolder.spaceId!}/${selectedFolder.id!}`);
                } else {
                    await axios.patch(`${SERVER.API.PROJECT}/move-to-space/${projectId!}/${selectedSpace.id!}`);
                }
            }
            await fetchMySpaceList();
            await fetchFavSpaceList();
            dispatch(setOpenFormMoveProject(false));
        } catch (error) {
            throw new Error(error as string);
        }
    };

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => dispatch(setOpenFormMoveProject(false))}>
                    <Transition.Child
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
                                <Dialog.Panel className="w-full h-auto max-w-xl p-6 text-left align-middle transition-all transform rounded-lg shadow-lg bg-default text-default">
                                    <Dialog.Title
                                        as="h3"
                                        className="mb-2 text-lg font-bold leading-6 text-default"
                                    >
                                        {'Move to'}
                                        <button
                                            type="button"
                                            className="float-right text-default"
                                            onClick={() => dispatch(setOpenFormMoveProject(false))}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1} className="flex items-center">
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                <span className="mr-2">{'🚀 Space'}</span>
                                            </Grid.Column>
                                            <Grid.Column sm={4} md={4} lg={4} xl={4} xxl={4}>
                                                <ListboxSpace setSelectedSpace={setSelectedSpace} />
                                            </Grid.Column>
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                <span className="mr-2">{'📁 Folder'}</span>
                                            </Grid.Column>
                                            <Grid.Column sm={4} md={4} lg={4} xl={4} xxl={4}>
                                                <ListboxFolder spaceId={selectedSpace && selectedSpace.id} setSelectedFolder={setSelectedFolder} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="w-full text-white bg-pink-400 button hover:bg-pink-500 focus:bg-pink-500">{'Move'}</button>
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