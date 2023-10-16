import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useSelector } from 'react-redux';
import { getToken } from '../../redux/Authentication/selectors';
import { getUser } from '../../redux/User/selectors';

interface Props {
    setAssignee: (assigneeId: number | null) => void;
    setAssigneeName: (assigneeName: string) => void;
}

const Component = ({ setAssignee, setAssigneeName }: Props) => {

    const user = useSelector(getUser);
    const token = useSelector(getToken);
    const config = {
        headers: {
            'Authorization': `Bearer ${token!}`
        }
    };

    const [selectedUser, setselectedUser] = React.useState<User | null>(null);

    const handleMenuItemClick = (assignees: User) => {
        setAssignee(assignees.id);
        setAssigneeName(assignees.fullName);
    };


    return (
        <div className="w-72 bg-default">
            <Menu>
                <Menu.Button className="grid w-full  justify-items-end ">
                    <UserPlusIcon className="icon-x24" title="Assign" />
                </Menu.Button>
                <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className={'mt-4 w-48 text-sm text-default bg-default border border-zinc-200 dark:border-zinc-200'}>
                        <div className="absolute z-50  justify-items-end">
                            {Array.isArray(user) && user.map((assignee: User, index: number) => (
                                <Menu.Item key={index}>
                                    <React.Fragment>
                                        <div className="bg-default w-64 p-4 rounded-lg shadow-md" onClick={() => handleMenuItemClick(assignee)}>
                                            {assignee.fullName}
                                        </div>

                                    </React.Fragment>
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>

            {/* <Listbox value={selectedUser} onChange={setselectedUser}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full bg-default py-2 pl-3 pr-10 text-left">
                        <UserPlusIcon className="icon-x24" title="Assign" />
                    </Listbox.Button>
                    <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-default border border-default py-1">
                            {Array.isArray(user) && user.map((usr: User, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 text-default ${active ? 'bg-default-faded' : ''}`
                                    }
                                    value={usr ? usr : null}
                                >
                                    {({ selected }) => (
                                        <React.Fragment>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                            >
                                                {usr.fullName}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-default">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </React.Fragment>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox> */}
        </div>
    );

};

export default Component;