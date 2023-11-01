import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormMoveFolder } from '../../redux/Dialog/actions';
import { getOpenFormMoveFolder } from '../../redux/Dialog/selectors';
import { getFolderId } from '../../redux/Sidebar/selectors';
import Http from '../../services/Http';
import { Space } from '../../types/Space';
import { API } from '../../utils/api';
import { Grid } from '../Grid';
import { ListboxSpace } from '../Listbox';

interface Props {
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormMoveFolder);
    const folderId = useSelector(getFolderId);
    const [selectedSpace, setSelectedSpace] = React.useState<Space | null>(null);

    const handleClose = () => {
        dispatch(setOpenFormMoveFolder(false));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (selectedSpace) {
                await Http.change(`${API.FOLDER}/move-to-space/${folderId!}/${selectedSpace.id!}`);
            }
            await fetchMySpaceList();
            await fetchFavSpaceList();
        } catch (error) {
            throw new Error(error as string);
        } finally {
            handleClose();
        }
    };

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
                                <Dialog.Panel className="w-full h-auto transform rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default max-w-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 text-default mb-2 font-bold"
                                    >
                                        {'Move to'}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={handleClose}
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
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Move'}</button>
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