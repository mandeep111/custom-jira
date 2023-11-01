import { Dialog, Menu, Transition } from '@headlessui/react';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Priority } from '../../enum/Priority';
import { Status } from '../../enum/Status';
import { setOpenFormSubTaskDetail } from '../../redux/Dialog/actions';
import { getOpenFormSubTaskDetail } from '../../redux/Dialog/selectors';
import { setTaskId } from '../../redux/Task/actions';
import { getTaskId } from '../../redux/Task/selectors';
import Http from '../../services/Http';
import { API } from '../../utils/api';
import { Grid } from '../Grid';
import { PopoverColor } from '../Popover';
import { SubTask } from '../../types/SubTask';
import { User } from '../../types/User';

interface Props {
    subTaskId: number | null;
    fetchingData: () => Promise<void>;
}

const initialSubTaskState: SubTask = {
    taskId: null,
    name: '',
    description: '',
    color: '#94A3B8',
    status: Status.WAITING,
    priority: Priority.LOW,
    needApproval: false,
    requestCode: '',
    formId: null,
    start: null,
    end: null,
    assigneeId: null
};


const Component = ({ subTaskId, fetchingData }: Props) => {

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormSubTaskDetail);

    const [openNewSubTask, setOpenNewSubTask] = React.useState<boolean>(false);
    const [isCheckUser, setIsCheckUser] = React.useState<boolean>(false);
    const [userList, setUserList] = React.useState<User[]>([]);
    const taskId = useSelector(getTaskId);
    const [subTaskDetail, setSubTaskDetail] = React.useState<SubTask>();
    const [subTask, setSubTask] = React.useState<SubTask>(initialSubTaskState);

    // const fetchSubTaskById = async () => {
    //     try {
    //         if (subTaskId !== null) {
    //             const response: SubTask = await getById(subTaskId, config);
    //             setSubTask(response);
    //         }
    //     } catch (error) {
    //         throw new Error(error as string);
    //     }
    // };

    const fetchSubTask = async () => {
        try {
            const response: SubTask = await Http.getById(`${API.SUBTASK}/${subTaskId!}`);
            setSubTaskDetail(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchUserList = async () => {
        try {
            const response: User[] = await Http.getById(`${API.USER}/all-by-task/${taskId!}`);
            setUserList(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setSubTask((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setOpenFormSubTaskDetail(false));
        try {
            await Http.update(`${API.SUBTASK}/${subTaskDetail!.id!}`, subTask);

            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        } finally {
            dispatch(setTaskId(null));
        }
    };

    const handleMenuItemClick = (id: number) => {
        setSubTask((prevSubTask) => ({
            ...prevSubTask,
            assigneeId: id,
        }));
    };
    React.useEffect(() => {
        if (isOpen) {
            void fetchSubTask();
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (isCheckUser) {
            void fetchUserList();
            setIsCheckUser(false);
        }
    }, [isCheckUser]);

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {
                    dispatch(setOpenFormSubTaskDetail(false));
                    dispatch(setTaskId(null));
                }}>
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
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full transform overflow-hidden rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default max-w-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 text-default mb-2 font-bold"
                                    >
                                        {subTask.name}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={() => dispatch(setOpenFormSubTaskDetail(false))}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1} className="mt-3">
                                            <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10} className="flex">
                                                <div className="w-72 bg-default">
                                                    <Menu as="div" className="relative inline-block text-left">
                                                        <div>
                                                            <Menu.Button className="flex items-center">
                                                                <UserPlusIcon className="icon-x20 mt-2" fill="transparent" onClick={() => setIsCheckUser(true)} />
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
                                                                <div className="px-1 py-1 max-h-40 overflow-y-scroll">
                                                                    <React.Fragment>
                                                                        {Array.isArray(userList) && userList.map((user: User, index: number) => (
                                                                            <Menu.Item key={index}>
                                                                                {() => (
                                                                                    <React.Fragment>
                                                                                        <div
                                                                                            className="group text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer"
                                                                                            onClick={() => handleMenuItemClick(user.id!)}
                                                                                        >
                                                                                            {user.fullName}
                                                                                        </div>
                                                                                    </React.Fragment>
                                                                                )}
                                                                            </Menu.Item>
                                                                        ))}
                                                                    </React.Fragment>
                                                                </div>
                                                            </Menu.Items>
                                                        </Transition>
                                                    </Menu>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                {subTaskDetail?.assignee ? (
                                                    <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">
                                                        <span
                                                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-yellow-500 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-50 font-bold"
                                                            title={subTaskDetail.assignee?.fullName}
                                                        >
                                                            {subTaskDetail.assignee.fullName?.toUpperCase().charAt(0)}
                                                        </span>
                                                        <p className="p-1">{subTaskDetail.assignee.fullName?.toUpperCase()}</p>
                                                    </div>
                                                ) : null}
                                            </Grid.Column>
                                        </Grid>

                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                {subTask.start || subTask.end ? (
                                                    <div className="inline-flex">
                                                        <p className="mb-2 text-sm text-default mr-3">
                                                            {'Start : '}
                                                            {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subTask.start!))}
                                                        </p>
                                                        <p className="mb-2 text-sm text-default">
                                                            {'End : '}
                                                            {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subTask.end!))}
                                                        </p>
                                                    </div>
                                                ) : null}
                                            </Grid.Column >
                                        </Grid >
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input
                                                    type="text"
                                                    maxLength={32}
                                                    value={subTask?.name || ''}
                                                    placeholder="Task name"
                                                    className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => setSubTask({ ...subTask, name: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>

                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <textarea
                                                    value={subTask?.description || ''}
                                                    className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    placeholder="Write something about this task..."
                                                    rows={5}
                                                    onChange={(event) => setSubTask({ ...subTask, description: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-start">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <PopoverColor color={subTask.color} onClick={handleColorChange} />
                                            </Grid.Column>
                                        </Grid>

                                        <Grid column={12} gap={1} className="mt-5 text-start">
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                {'Progress :'}
                                            </Grid.Column>
                                            <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                                                {subTask?.status}
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Update'}</button>
                                            </Grid.Column>
                                        </Grid>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </React.Fragment >
    );

};

export default Component;