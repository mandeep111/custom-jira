import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormRenameProject } from '../../redux/Dialog/actions';
import { getOpenFormRenameProject } from '../../redux/Dialog/selectors';
import { setProjectName } from '../../redux/Sidebar/actions';
import { getProjectId, getProjectName } from '../../redux/Sidebar/selectors';
import Http from '../../services/Http';
import { API } from '../../utils/api';
import { Grid } from '../Grid';

interface Props {
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const dispatch = useDispatch();
    const projectId = useSelector(getProjectId);
    const projectName = useSelector(getProjectName);
    const isOpen = useSelector(getOpenFormRenameProject);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await Http.update(`${API.PROJECT}/name/${projectId!}?name=${projectName}`);
            dispatch(setOpenFormRenameProject(false));
            await fetchMySpaceList();
            await fetchFavSpaceList();
            dispatch(setProjectName(''));
        } catch (error) {
            throw new Error(error as string);
        }
    };

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => dispatch(setOpenFormRenameProject(false))}>
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
                                <Dialog.Panel className="w-full transform overflow-hidden rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default max-w-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 text-default mb-2 font-bold"
                                    >
                                        {'Rename Project'}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={() => dispatch(setOpenFormRenameProject(false))}
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
                                                    maxLength={32}
                                                    placeholder="Project Name"
                                                    value={projectName}
                                                    className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => dispatch(setProjectName(event.target.value))}
                                                    required
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Rename'}</button>
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