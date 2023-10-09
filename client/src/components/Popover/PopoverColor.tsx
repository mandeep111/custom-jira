import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Color } from '../Color';

interface Props {
    item: TodoState;
}

interface TodoState {
    id: number;
    taskStageId: number;
    taskStageName: string;
    projectId: number;
    name: string;
    description: string;
    assignees: User[];
    tags: [];
    color: string;
    start: Date;
    end: Date;
    type: string;
    isDisabled: boolean;
    progress: number;
}

interface User {
    id: number | null;
    fullName: string;
    email: string;
}

const Component = ({ item }: Props) => {


    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        // setTask((prevState) => ({
        //     ...prevState,
        //     color: target.value
        // }));
    };

    return (
        <React.Fragment>
            <div className="w-full max-w-sm">
                <Popover className="relative">
                    {() => (
                        <React.Fragment>
                            <Popover.Button
                                className="rounded-full p-3 w-0 focus:ring-4 focus:ring-default"
                                style={{ backgroundColor: item.color }}
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
                                    <div className="">
                                        <Color onClick={handleColorChange} />
                                    </div>
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