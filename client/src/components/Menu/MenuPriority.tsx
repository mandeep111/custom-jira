import { Menu, Transition } from '@headlessui/react';
import { FlagIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { Priority } from '../../enum/Priority';

interface Props {
    priority: Priority;
    setPriority: React.Dispatch<React.SetStateAction<Priority>>;
    handleChangePriority?: (priority?: Priority) => Promise<void>;
}

const Component = ({ priority, setPriority, handleChangePriority }: Props) => {

    const handleMarkPriority = (priority: Priority) => {
        setPriority(priority);
        if (handleChangePriority) {
            void handleChangePriority(priority);
        }
    };

    return (
        <React.Fragment>
            <Menu as="div" className="relative flex justify-end">
                <div>
                    <Menu.Button className="flex justify-end has-tooltip">
                        <FlagIcon className={`${priority === Priority.LOW ? 'text-green-400 dark:text-green-700' : ''} ${priority === Priority.NORMAL ? 'text-blue-400 dark:text-blue-700' : ''} ${priority === Priority.HIGH ? 'text-orange-400 dark:text-orange-700' : ''} ${priority === Priority.URGENT ? 'text-red-400 dark:text-red-700' : ''} icon-x20`} />
                        <span className="tooltip mt-7">{priority}</span>
                    </Menu.Button>
                </div>
                <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute w-64 mt-2 origin-top-left border divide-y divide-gray-100 rounded-md shadow-lg bg-default border-default">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                <button
                                    type="button"
                                    className="flex items-center w-full px-2 py-2 text-sm rounded-md cursor-pointer group hover:bg-default-faded text-default"
                                    onClick={() => handleMarkPriority(Priority.LOW)}
                                >
                                    <FlagIcon className="text-green-400 icon-x16 dark:text-green-700" />
                                    {Priority.LOW}
                                </button>
                            </Menu.Item>
                            <Menu.Item>
                                <button
                                    type="button"
                                    className="flex items-center w-full px-2 py-2 text-sm rounded-md cursor-pointer group hover:bg-default-faded text-default"
                                    onClick={() => handleMarkPriority(Priority.NORMAL)}
                                >
                                    <FlagIcon className="text-blue-400 icon-x16 dark:text-blue-700" />
                                    {Priority.NORMAL}
                                </button>
                            </Menu.Item>
                            <Menu.Item>
                                <button
                                    type="button"
                                    className="flex items-center w-full px-2 py-2 text-sm rounded-md cursor-pointer group hover:bg-default-faded text-default"
                                    onClick={() => handleMarkPriority(Priority.HIGH)}
                                >
                                    <FlagIcon className="text-orange-400 icon-x16 dark:text-orange-700" />
                                    {Priority.HIGH}
                                </button>
                            </Menu.Item>
                            <Menu.Item>
                                <button
                                    type="button"
                                    className="flex items-center w-full px-2 py-2 text-sm rounded-md cursor-pointer group hover:bg-default-faded text-default"
                                    onClick={() => handleMarkPriority(Priority.URGENT)}
                                >
                                    <FlagIcon className="text-red-400 icon-x16 dark:text-red-700" />
                                    {Priority.URGENT}
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </React.Fragment>
    );

};

export default Component;