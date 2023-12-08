
import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { getSpaceId } from '../../redux/Sidebar/selectors';
import { setUser } from '../../redux/User/actions';

interface Props {
    assign: Assign[];
    setAssign: React.Dispatch<React.SetStateAction<Assign[]>>;
    type?: 'CREATE' | 'UPDATE';
}

const Component = ({ assign, setAssign, type = 'CREATE' }: Props) => {

    const dispatch = useDispatch();
    const spaceId = useSelector(getSpaceId);
    const [userList, setUserList] = React.useState<User[]>([]);
    const [pageSize, setPageSize] = React.useState(5);
    const [totalElements, setTotalElements] = React.useState(0);

    const fetchUser = async () => {
        try {
            const response: AxiosResponse<APIResponse<User>> = await axios.get(`${SERVER.API.USER}/page?pageSize=${pageSize}`);
            const { content, totalElements } = response.data;
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

    const handleAssignClick = async (event: React.MouseEvent, id: number | null) => {
        event.preventDefault();
        const existingIndex = assign.findIndex((item) => item.id === id);
        if (type === 'CREATE') {
            if (existingIndex !== -1) {
                setAssign(assign.filter((item) => item.id !== id));
            } else {
                const user = userList.find((item) => item.id === id);
                if (user && user.fullName) {
                    setAssign([...assign, { id, fullName: user.fullName }]);
                }
            }
        } else if (type === 'UPDATE') {
            if (existingIndex !== -1) {
                setAssign(assign.filter((item) => item.id !== id));
                await axios.delete(`${SERVER.API.SPACE}/assign/${spaceId!}?userIds=${id!}`);
            } else {
                const user = userList.find((item) => item.id === id);
                if (user && user.fullName) {
                    setAssign([...assign, { id, fullName: user.fullName }]);
                    await axios.post(`${SERVER.API.SPACE}/assign/${spaceId!}?userIds=${id!}`);
                }
            }
        } else {
            throw new Error('Invalid type');
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
                        <UserPlusIcon className="mt-5 icon-x20" fill="transparent" />
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
                        <div className="px-1 py-1 overflow-y-scroll max-h-72">
                            <Menu.Item as="div">
                                {userList.map((user, index) => (
                                    <div
                                        key={index}
                                        className="relative flex items-center w-full px-2 py-2 pl-10 pr-4 text-sm rounded-md cursor-pointer select-none group text-default hover:bg-default-faded"
                                        onClick={(event) => void handleAssignClick(event, user.id)}
                                    >
                                        <span className="block font-normal truncate">
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
                                        className="relative flex items-center w-full px-2 py-2 pl-10 pr-4 text-sm rounded-md cursor-pointer select-none group text-default hover:bg-default-faded"
                                        onClick={handleLoadMore}
                                    >
                                        <span className="block font-normal truncate">
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