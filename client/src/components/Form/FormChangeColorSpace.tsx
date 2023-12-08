import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormChangeColorSpace } from '../../redux/Dialog/actions';
import { getOpenFormChangeColorSpace } from '../../redux/Dialog/selectors';
import { getSpaceId } from '../../redux/Sidebar/selectors';
import { Color } from '../Color';
import { Grid } from '../Grid';

interface Props {
    fetchMySpaceList: () => Promise<void>;
    fetchFavSpaceList: () => Promise<void>;
}

const Component = ({ fetchMySpaceList, fetchFavSpaceList }: Props) => {

    const dispatch = useDispatch();
    const spaceId = useSelector(getSpaceId);
    const isOpen = useSelector(getOpenFormChangeColorSpace);

    const [color, setColor] = React.useState<string>('');

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.put(`${SERVER.API.SPACE}/color/${spaceId!}?color=${color}`);
            dispatch(setOpenFormChangeColorSpace(false));
            await fetchMySpaceList();
            await fetchFavSpaceList();
            setColor('');
        } catch (error) {
            throw new Error(error as string);
        }
    };

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => dispatch(setOpenFormChangeColorSpace(false))}>
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
                                        {'🎨'}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={() => dispatch(setOpenFormChangeColorSpace(false))}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <Color onClick={(event) => setColor(encodeURIComponent(event.currentTarget.value))} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Change'}</button>
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