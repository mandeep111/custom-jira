import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import { Color } from '../Color';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    color?: string;
}

const Component = ({ color, onClick }: Props) => {

    return (
        <React.Fragment>
            <div className="w-full max-w-sm">
                <Popover className="relative">
                    {({ close }) => (
                        <React.Fragment>
                            <Popover.Button
                                className="rounded-full p-3 w-0 focus:ring-4 focus:ring-default"
                                style={{ backgroundColor: color }}
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
                                <Popover.Panel className="absolute flex align-middle justify-center items-center text-center mt-3 border pb-4 pt-2 border-default bg-default-faded rounded-lg w-full overflow-x-auto flex-wrap z-50">
                                    {onClick && <Color onClick={(event) => {
                                        onClick(event);
                                        close();
                                    }} />}
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