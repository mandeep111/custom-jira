import { Dialog, Menu, Transition } from '@headlessui/react';
import { CalendarDaysIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Priority } from '../../enum/Priority';
import { Status } from '../../enum/Status';
import { setOpenFormSubTaskDetail } from '../../redux/Dialog/actions';
import { getOpenFormSubTaskDetail } from '../../redux/Dialog/selectors';
import { setSubtaskId } from '../../redux/Subtask/actions';
import { getSubtaskId } from '../../redux/Subtask/selectors';
import { setTaskId } from '../../redux/Task/actions';
import { Grid } from '../Grid';
import { PopoverColor } from '../Popover';

interface Props {
    fetchingData: () => Promise<void>;
}

const initialSubtaskState: Subtask = {
    id: null,
    taskId: null,
    taskName: '',
    projectId: null,
    projectName: '',
    spaceId: null,
    spaceName: '',
    name: '',
    color: '',
    description: '',
    priority: Priority.NORMAL,
    type: '',
    status: Status.WAITING,
    formId: null,
    needApproval: false,
    requestCode: '',
    url: '',
    start: '',
    end: '',
    assigneeId: null,
    isBlocked: false,
    blockedBy: null
};

const Component = ({ fetchingData }: Props) => {

    const dispatch = useDispatch();
    const subtaskId = useSelector(getSubtaskId);
    const isOpen = useSelector(getOpenFormSubTaskDetail);

    const [openNewSubTask, setOpenNewSubTask] = React.useState<boolean>(false);
    const [isCheckUser, setIsCheckUser] = React.useState<boolean>(false);
    const [userList, setUserList] = React.useState<User[]>([]);
    const [subtask, setSubtask] = React.useState<Subtask>(initialSubtaskState);
    const [requestCodeStatus, setRequestCodeStatus] = React.useState<string>('');

    const fetchSubTask = async () => {
        try {
            const response: AxiosResponse<Subtask> = await axios.get(`${SERVER.API.SUBTASK}/${subtaskId!}`);
            setSubtask(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchRequestStatus = async () => {
        try {
            const response = await axios.get(`${SERVER.API.FORM}/status/${subtask.requestCode}`);
            setRequestCodeStatus(response.data ? 'COMPLETED' : 'WAITING');
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchUserList = async () => {
        try {
            const response: AxiosResponse<User[]> = await axios.get(`${SERVER.API.USER}/all-by-task/${subtask.taskId!}`);
            setUserList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const changeAssignee = async (userId: number) => {
        try {
            const response: AxiosResponse<Subtask> = await axios.patch(`${SERVER.API.SUBTASK}/change-assignee/${subtaskId!}/${userId}`);
            setSubtask(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setSubtask((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.put(`${SERVER.API.SUBTASK}/${subtask.id!}`, subtask);
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        } finally {
            dispatch(setTaskId(null));
            dispatch(setOpenFormSubTaskDetail(false));
        }
    };

    const handleOnclick = () => {
        if (subtask.url) {
            window.open(subtask.url, '_blank');
        }
    };

    const handleClose = () => {
        dispatch(setOpenFormSubTaskDetail(false));
        dispatch(setTaskId(null));
        dispatch(setSubtaskId(null));
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

    React.useEffect(() => {
        subtask.requestCode && void fetchRequestStatus();
    }, [subtask.requestCode]);

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-xl p-6 text-left align-middle transition-all transform rounded-lg shadow-lg bg-default text-default">
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={1} gap={1}>
                                            <div className="flex items-center whitespace-nowrap">
                                                <p className="inline-flex items-center py-2 text-xs text-default">
                                                    <CalendarDaysIcon className="icon-x16" />
                                                    {subtask?.start && (
                                                        new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subtask.start))
                                                    )}
                                                </p>
                                                <p className="inline-flex items-center px-2 py-2 text-xs text-default">
                                                    {'—'}
                                                </p>
                                                <p className="inline-flex items-center py-2 text-xs text-default">
                                                    {subtask?.end && (
                                                        new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(subtask.end))
                                                    )}
                                                </p>
                                            </div>
                                        </Grid>
                                        <Grid column={1} gap={1}>
                                            <div className="flex items-center justify-between">
                                                <div className="w-72 bg-default">
                                                    <Menu as="div" className="relative inline-block text-left">
                                                        <div>
                                                            <Menu.Button className="flex items-center">
                                                                <UserPlusIcon className="mt-2 icon-x20" fill="transparent" onClick={() => setIsCheckUser(true)} />
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
                                                                <div className="px-1 py-1 max-h-40">
                                                                    <React.Fragment>
                                                                        {Array.isArray(userList) && userList.map((user: User, index: number) => (
                                                                            <Menu.Item key={index}>
                                                                                {() => (
                                                                                    <React.Fragment>
                                                                                        <div
                                                                                            className="flex items-center w-full px-2 py-2 text-sm rounded-md cursor-pointer group text-default hover:bg-default-faded"
                                                                                            onClick={() => void changeAssignee(user.id!)}
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
                                                {subtask.assignee && (
                                                    <div className="flex items-center has-tooltip">
                                                        <label
                                                            className="flex items-center justify-center text-xs font-bold text-center align-middle bg-yellow-500 border rounded-full w-7 h-7 border-zinc-300 text-zinc-50"
                                                        >
                                                            {subtask.assignee.fullName?.toUpperCase().charAt(0)}
                                                        </label>
                                                        <div className="mt-20 tooltip">
                                                            {subtask.assignee.fullName}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input
                                                    type="text"
                                                    maxLength={255}
                                                    value={subtask.name || ''}
                                                    placeholder="SubTask Name"
                                                    className="flex w-full py-2 text-xl bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => setSubtask((prevState) => ({ ...prevState, name: event.target.value }))}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <textarea
                                                    value={subtask.description || ''}
                                                    className="flex w-full py-2 bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    placeholder="Write something about this task..."
                                                    rows={5}
                                                    onChange={(event) => setSubtask((prevState) => ({ ...prevState, description: event.target.value }))}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-start">
                                            {subtask.url ? (
                                                <React.Fragment>
                                                    <Grid.Column sm={3} md={3} lg={3} xl={3} xxl={3}>
                                                        <div> {'REQUEST_CODE :'}</div>
                                                    </Grid.Column>
                                                    <Grid.Column sm={7} md={7} lg={7} xl={7} xxl={7}>
                                                        <input
                                                            type="text"
                                                            maxLength={255}
                                                            value={subtask.requestCode || ''}
                                                            placeholder="requestCode"
                                                            className="flex w-full bg-transparent border-b border-transparent outline-none text-md text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                            autoComplete="off"
                                                            onChange={(event) => {
                                                                setSubtask((prevState) => {
                                                                    if (prevState) {
                                                                        return {
                                                                            ...prevState,
                                                                            requestCode: event.target.value
                                                                        };
                                                                    } else {
                                                                        return prevState;
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </Grid.Column>
                                                    <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                        <label>{requestCodeStatus}</label>
                                                    </Grid.Column>
                                                </React.Fragment>
                                            ) : null}
                                        </Grid>
                                        <Grid column={12} gap={1} className="pb-3">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <PopoverColor color={subtask.color} onClick={handleColorChange} />
                                            </Grid.Column>
                                        </Grid>
                                        {WORKFLOW_ENABLED && (
                                            <Grid column={12} gap={1} className="pb-3">
                                                <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                    <span className="text-sm"> {'Form URL :'}</span>
                                                </Grid.Column>
                                                <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                                                    <span className="text-blue-600" onClick={handleOnclick}>{subtask.url}</span>
                                                </Grid.Column>
                                            </Grid>
                                        )}
                                        <Grid column={1} gap={1}>
                                            <h5 className="text-sm text-default">{'Status : '}
                                                {subtask.status === 'WAITING'
                                                    ? <label title="Waiting">{'⏳'}</label>
                                                    : subtask.status === 'DOING'
                                                        ? <label title="Doing">{'🏃'}</label>
                                                        : subtask.status === 'COMPLETED'
                                                            ? <label title="Done">{'✅'}</label>
                                                            : <label title="Cancel">{'❌'}</label>
                                                }
                                            </h5>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="w-full text-white bg-pink-400 button hover:bg-pink-500 focus:bg-pink-500">{'Update'}</button>
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