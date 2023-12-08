import { Popover, Transition } from '@headlessui/react';
import React from 'react';

interface Props {
    assignee: Assign[];
    handleUnassigned: (id: number | null) => Promise<void>
}

const Component = ({ assignee, handleUnassigned }: Props) => {

    return (
        <React.Fragment>
            <Popover className="flex justify-end ml-auto">
                <Popover.Button className="flex justify-end mt-2 -space-x-3">
                    {assignee.slice(0, 5).map((assn, index) => (
                        <span
                            key={index}
                            title={assn.fullName}
                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                        >
                            {assn.fullName?.toUpperCase().charAt(0)}
                        </span>
                    ))}
                </Popover.Button>
                {assignee && (
                    Array.isArray(assignee) && assignee.length > 5 && (
                        <span
                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-indigo-400 border border-indigo-300 align-middle items-center flex text-center justify-center text-indigo-100 font-bold"
                            title={assignee.slice(5).map((item) => item.fullName).join(', ')}
                        >
                            {`+${assignee.length - 5}`}
                        </span>
                    )
                )}
                <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel className="absolute z-50 flex flex-wrap items-center justify-center max-w-xl p-3 overflow-x-auto text-center border rounded-lg border-default bg-default-faded mt-11">
                        {assignee.map((assn, index) => (
                            <span
                                key={index}
                                className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold cursor-pointer"
                                title={assn.fullName}
                                onClick={() => void handleUnassigned(assn.id)}
                            >
                                {assn.fullName?.toUpperCase().charAt(0)}
                            </span>
                        ))}
                    </Popover.Panel>
                </Transition>
            </Popover>
        </React.Fragment>
    );

};

export default Component;