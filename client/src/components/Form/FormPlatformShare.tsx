import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LineIcon, LineShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { setOpenFormPlatformShare } from '../../redux/Dialog/actions';
import { getOpenFormPlatformShare } from '../../redux/Dialog/selectors';
import { Grid } from '../Grid';

const Component = () => {

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormPlatformShare);

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => dispatch(setOpenFormPlatformShare(false))}>
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
                                        {'Share to platform'}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={() => dispatch(setOpenFormPlatformShare(false))}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <FacebookShareButton
                                                    url={window.location.href}
                                                    className="mr-2"
                                                    onClick={() => dispatch(setOpenFormPlatformShare(false))}
                                                >
                                                    <FacebookIcon size={32} round />
                                                </FacebookShareButton>
                                                <LineShareButton
                                                    url={window.location.href}
                                                    className="mr-2"
                                                    onClick={() => dispatch(setOpenFormPlatformShare(false))}
                                                >
                                                    <LineIcon size={32} round />
                                                </LineShareButton>
                                                <WhatsappShareButton
                                                    url={window.location.href}
                                                    className="mr-2"
                                                    onClick={() => dispatch(setOpenFormPlatformShare(false))}
                                                >
                                                    <WhatsappIcon size={32} round />
                                                </WhatsappShareButton>
                                                <EmailShareButton
                                                    url={window.location.href}
                                                    className="mr-2"
                                                    onClick={() => dispatch(setOpenFormPlatformShare(false))}
                                                >
                                                    <EmailIcon size={32} round />
                                                </EmailShareButton>
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