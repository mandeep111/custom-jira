import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import { Assign } from '../../types/Assign';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    assignee: Assign;
}

const Component = ({ assignee, onClick }: Props) => {

    return (
        <React.Fragment>
            <div className="w-full max-w-sm mt-5">
                <Popover className="relative">
                    <React.Fragment>
                        <Popover.Button
                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                            title={assignee.fullName}
                        >
                            {assignee.fullName?.toUpperCase().charAt(0)}
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
                                <span
                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                    title={assignee.fullName}
                                    onClick={() => onClick}
                                >
                                    {assignee.fullName?.toUpperCase().charAt(0)}
                                </span>
                            </Popover.Panel>
                        </Transition>
                    </React.Fragment>
                </Popover>
            </div>
        </React.Fragment >
    );

};

export default Component;