import { Popover, Transition } from '@headlessui/react';
import React from 'react';

const Component = () => {

    return (
        <React.Fragment>
            <div className="w-full max-w-sm">
                <Popover className="relative bg-red-600">
                    {() => (
                        <React.Fragment>
                            <Popover.Button
                                className="rounded-full p-3 w-0 focus:ring-4 focus:ring-default"
                            >
                            </Popover.Button>
                            <Transition
                                as={React.Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute flex align-middle justify-center items-center text-center mt-3 border pb-4 pt-2 border-default bg-default-faded rounded-lg w-full">

                                </Popover.Panel>
                            </Transition>
                        </React.Fragment>
                    )}
                </Popover>
            </div>
        </React.Fragment>
    );

};

export default Component;