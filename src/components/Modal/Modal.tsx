import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DialogProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    position?: 'top' | 'center' | 'bottom';
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const Component = ({ title, children, position, className, isOpen, setIsOpen }: DialogProps) => {

    let modalPosition;

    switch (position) {
        case 'top':
            modalPosition = 'items-start';
            break;
        case 'center':
            modalPosition = 'items-center';
            break;
        case 'bottom':
            modalPosition = 'items-end';
            break;
        default:
            modalPosition = 'items-center';
            break;
    }

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                        <div className={`flex min-h-full ${modalPosition} justify-center p-4 text-center`}>
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`${className || ''} w-full transform overflow-hidden rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default`}>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 text-default mb-2 font-bold"
                                    >
                                        {title}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    {children}
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