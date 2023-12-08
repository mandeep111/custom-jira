import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormRenameSpace } from '../../redux/Dialog/actions';
import { getOpenFormRenameSpace } from '../../redux/Dialog/selectors';
import { setSpaceName } from '../../redux/Sidebar/actions';
import { getSpaceId, getSpaceName } from '../../redux/Sidebar/selectors';
import { Grid } from '../Grid';
import axios from 'axios';

interface Props {
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const dispatch = useDispatch();
    const spaceId = useSelector(getSpaceId);
    const spaceName = useSelector(getSpaceName);
    const isOpen = useSelector(getOpenFormRenameSpace);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.put(`${SERVER.API.SPACE}/name/${spaceId!}?name=${spaceName}`);
            dispatch(setOpenFormRenameSpace(false));
            await fetchMySpaceList();
            await fetchFavSpaceList();
            dispatch(setSpaceName(''));
        } catch (error) {
            throw new Error(error as string);
        }
    };

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => dispatch(setOpenFormRenameSpace(false))}>
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
                                        {'Rename Space'}
                                        <button
                                            type="button"
                                            className="float-right text-default"
                                            onClick={() => dispatch(setOpenFormRenameSpace(false))}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    maxLength={255}
                                                    value={spaceName}
                                                    placeholder="Space name"
                                                    className="flex w-full py-2 text-xl bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => dispatch(setSpaceName(event.target.value))}
                                                    required
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="w-full text-white bg-pink-400 button hover:bg-pink-500 focus:bg-pink-500">{'Rename'}</button>
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