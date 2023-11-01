
import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { setUser } from '../../redux/User/actions';
import Http from '../../services/Http';
import { API } from '../../utils/api';
import { Assign } from '../../types/Assign';
import { User } from '../../types/User';

interface Props {
    assign: Assign[];
    setAssign: React.Dispatch<React.SetStateAction<Assign[]>>;
}

const Component = ({ assign, setAssign }: Props) => {

    const dispatch = useDispatch();
    const [userList, setUserList] = React.useState<User[]>([]);
    const [pageSize, setPageSize] = React.useState(5);
    const [totalElements, setTotalElements] = React.useState(0);

    const fetchUser = async () => {
        try {
            const response: { content: User[], totalElements: number } = await Http.get(`${API.USER}/page?pageSize=${pageSize}`);
            const { content, totalElements } = response;
            setUserList(content);
            setTotalElements(totalElements);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleLoadMore = (event: React.MouseEvent) => {
        event.preventDefault();
        setPageSize(pageSize + 5);
        dispatch(setUser(pageSize) as unknown as AnyAction);
    };

    // const handleAssignClick = (event: React.MouseEvent, id: number | null) => {
    //     event.preventDefault();
    //     const existingIndex = assign.findIndex((item) => item.id === id);
    //     if (existingIndex !== -1) {
    //         const newAssign = [...assign.slice(0, existingIndex), ...assign.slice(existingIndex + 1)];
    //         setAssign(newAssign);
    //     } else {
    //         setAssign([...assign, { id, fullName: userList.find((item) => item.id === id)?.fullName }]);
    //     }
    // };

    const handleAssignClick = (event: React.MouseEvent, id: number | null) => {
        event.preventDefault();
        const existingIndex = assign.findIndex((item) => item.id === id);
        if (existingIndex !== -1) {
            const newAssign = [...assign.slice(0, existingIndex), ...assign.slice(existingIndex + 1)];
            setAssign(newAssign);
        } else {
            const user = userList.find((item) => item.id === id);
            if (user && user.fullName) {
                setAssign([...assign, { id, fullName: user.fullName }]);
            }
        }
    };


    React.useEffect(() => {
        void fetchUser();
    }, [pageSize]);

    return (
        <div className="text-left">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex items-center">
                        <UserPlusIcon className="icon-x20 mt-5" fill="transparent" />
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
                    <Menu.Items className="absolute mt-2 w-64 origin-top-left divide-y divide-gray-100 rounded-md bg-default shadow-lg border border-default">
                        <div className="px-1 py-1 max-h-72 overflow-y-scroll">
                            <Menu.Item as="div">
                                {userList.map((user, index) => (
                                    <div
                                        key={index}
                                        className="relative select-none pl-10 pr-4 group text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer"
                                        onClick={(event) => handleAssignClick(event, user.id)}
                                    >
                                        <span className="block truncate font-normal">
                                            {user.fullName}
                                        </span>
                                        {assign && assign.some((assn) => assn.id === user.id) && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <CheckIcon className="icon-x16 text-default" />
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {userList.length !== totalElements && (
                                    <div
                                        className="relative select-none pl-10 pr-4 group text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer"
                                        onClick={handleLoadMore}
                                    >
                                        <span className="block truncate font-normal">
                                            {'Load more...'}
                                        </span>
                                    </div>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default Component;