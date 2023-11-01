import { Dialog, Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import { FlagIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Priority } from '../../enum/Priority';
import { setOpenFormNewSubTask, setOpenFormSubTaskDetail, setOpenFormTaskDetail } from '../../redux/Dialog/actions';
import { getOpenFormTaskDetail } from '../../redux/Dialog/selectors';
import { setTaskId } from '../../redux/Task/actions';
import { getTaskId } from '../../redux/Task/selectors';
import Http from '../../services/Http';
import { Task } from '../../types/Task';
import { API } from '../../utils/api';
import { Grid } from '../Grid';
import { PopoverAssignee, PopoverColor } from '../Popover';
import { ProgressBarTask } from '../ProgressBar';
import { FormNewSubTask, FormSubTaskDetail } from './index';
import { User } from '../../types/User';
import { SubTask } from '../../types/SubTask';

interface Props {
    fetchTaskList: () => Promise<void>;
}

const initialTaskState: Task = {
    projectId: null,
    taskStageId: 1,
    name: '',
    description: '',
    assignee: [],
    color: '#FCA5A5',
    start: null,
    end: null,
    type: '',
    priority: Priority.LOW,
    tags: []
};

const Component = ({ fetchTaskList }: Props) => {

    const dispatch = useDispatch();
    const taskId = useSelector(getTaskId);
    const isOpen = useSelector(getOpenFormTaskDetail);

    const { spaceId } = useParams();
    const [userList, setUserList] = React.useState<User[]>([]);
    const [subTaskId, setSubTaskId] = React.useState<number | null>(null);
    const [task, setTask] = React.useState<Task>(initialTaskState);
    const [priority, setPriority] = React.useState(Priority.LOW);
    const [priorityColor, setPriorityColor] = React.useState('#27AE60');

    const fetchTask = async () => {
        try {
            const response: Task = await Http.getById(`${API.TASK}/${taskId!}`);
            setTask(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchUser = async () => {
        try {
            const response: User[] = await Http.getById(`${API.USER}/all-by-space/${spaceId!}`);
            setUserList(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const updateStatusState = async (data: { id: number, status: string }) => {
        try {
            await Http.updateStatus(`${API.SUBTASK}/change-status`, data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, subTaskId: number) => {
        try {
            const isChecked = event.target.checked;
            const newStatus = isChecked ? 'COMPLETED' : 'WAITING';
            const data = {
                id: subTaskId,
                status: newStatus
            };
            await updateStatusState(data);
            await fetchTaskList();
            await fetchTask();

        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setTask((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleAssign = async (id: number | null) => {
        try {
            await Http.add(`${API.TASK}/assignee/${taskId!}/${id!}`, null);
            await fetchTask();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleSelectPriority = () => {
        const priorityArray = Object.values(Priority);
        if (task) {
            const currentIndex = priorityArray.indexOf(task.priority);
            const nextIndex = (currentIndex + 1) % priorityArray.length;
            const nextPriority = priorityArray[nextIndex];
            setPriority(nextPriority);
            switch (nextPriority) {
                case Priority.URGENT:
                    setPriorityColor('#C0392B');
                    break;
                case Priority.HIGH:
                    setPriorityColor('#F1C40F');
                    break;
                case Priority.MEDIUM:
                    setPriorityColor('#2980B9');
                    break;
                case Priority.LOW:
                    setPriorityColor('#27AE60');
                    break;
                default:
                    setPriorityColor('#27AE60');
            }
            toast.dismiss();
            toast.info(nextPriority, {
                icon: '🏳️',
            });
        }
    };

    const handleUnassigned = async (id: number | null) => {
        try {
            await Http.remove(`${API.TASK}/assignee/${taskId!}/${id!}`);
            await fetchTask();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDuplicate = async () => {
        try {
            await Http.duplicate(`${API.TASK}/duplicate/${taskId!}`, null);
            handleOnClose();
            await fetchTaskList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDelete = async () => {
        try {
            await Http.remove(`${API.TASK}/${taskId!}`);
            handleOnClose();
            await fetchTaskList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await Http.update(`${API.TASK}/${taskId!}`, task);
            await fetchTaskList();
            await fetchTask();
            handleOnClose();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleOnClose = () => {
        setTimeout(() => {
            dispatch(setTaskId(null));
            setTask(task);
            setUserList([]);
        }, 300);
        dispatch(setOpenFormTaskDetail(false));
    };

    React.useEffect(() => {
        if (taskId) {
            void fetchTask();
            void fetchUser();
        } else {
            setTask(task);
            setUserList([]);
        }
    }, [taskId]);

    // React.useEffect(() => {
    //     setTask((prevState) => ({
    //         ...prevState,
    //         priority
    //     }) as Task | null );
    // }, [priority]);

    React.useEffect(() => {
        if (task) {
            switch (task.priority) {
                case Priority.URGENT:
                    setPriorityColor('#C0392B');
                    break;
                case Priority.HIGH:
                    setPriorityColor('#F1C40F');
                    break;
                case Priority.MEDIUM:
                    setPriorityColor('#2980B9');
                    break;
                case Priority.LOW:
                    setPriorityColor('#27AE60');
                    break;
                default:
                    setPriorityColor('#27AE60');
            }
        }
    }, [task?.priority]);

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleOnClose}>
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
                                <Dialog.Panel className="w-full transform rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default max-w-2xl">
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                <div className="flex my-2">
                                                    <p className="inline-flex items-center py-2 text-sm text-default">
                                                        <HeroIcons.CalendarDaysIcon className="icon-x16" />
                                                        {task?.start && (
                                                            new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.start))
                                                        )}
                                                    </p>
                                                    <p className="inline-flex items-center px-2 py-2 text-sm text-default">
                                                        {'—'}
                                                    </p>
                                                    <p className="inline-flex items-center py-2 text-sm text-default">
                                                        {task?.end && (
                                                            new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.end))
                                                        )}
                                                    </p>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                <div className="flex justify-end my-2">
                                                    <button
                                                        type="button"
                                                        title="Duplicate"
                                                        className="inline-flex items-center px-2 py-2 text-sm text-default bg-default-faded border border-default rounded-l-lg hover:bg-default"
                                                        onClick={() => void handleDuplicate()}>
                                                        <HeroIcons.Square2StackIcon className="icon-x16 mr-0" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        className="inline-flex items-center px-2 py-2 text-sm text-red-500 bg-default-faded border border-default rounded-r-md hover:bg-default"
                                                        onClick={() => void handleDelete()}
                                                    >
                                                        <HeroIcons.TrashIcon className="icon-x16 mr-0" />
                                                    </button>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                <div className="text-left">
                                                    <Menu as="div" className="relative inline-block text-left">
                                                        <div>
                                                            <Menu.Button
                                                                title="Assignee"
                                                                className="flex items-center"
                                                            >
                                                                <HeroIcons.UserPlusIcon className="icon-x20 mt-2" />
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
                                                                    {Array.isArray(userList) && userList.map((user: User, index: number) => (
                                                                        <Menu.Item key={index}>
                                                                            <div
                                                                                className="group text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer"
                                                                                onClick={() => {
                                                                                    void handleAssign(user.id);
                                                                                }}
                                                                            >
                                                                                {user.fullName}
                                                                            </div>
                                                                        </Menu.Item>
                                                                    ))}
                                                                </div>
                                                            </Menu.Items>
                                                        </Transition>
                                                    </Menu>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                <div className="flex mt-2 -space-x-3 justify-end">
                                                    {task?.assignee.slice(0, 5).map((data, index) => (
                                                        // <span
                                                        //     key={index}
                                                        //     className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                        //     title={data.fullName}
                                                        // >
                                                        //     {data.fullName?.toUpperCase().charAt(0)}
                                                        // </span>
                                                        <PopoverAssignee assignee={data} onClick={() => void handleUnassigned(data.id)} key={index} />
                                                    ))}
                                                    {task?.assignee && (
                                                        Array.isArray(task?.assignee) && task.assignee.length > 5 && (
                                                            <div>
                                                                <span
                                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-indigo-400 border border-indigo-300 align-middle items-center flex text-center justify-center text-indigo-100 font-bold"
                                                                    title={task.assignee.slice(5).map((item) => item.fullName).join(', ')}
                                                                >
                                                                    {`+${task?.assignee.length - 5}`}
                                                                    <PopoverColor color={task?.color} onClick={handleColorChange} />
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                                                <input
                                                    type="text"
                                                    maxLength={32}
                                                    value={task?.name || ''}
                                                    className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => setTask({ ...task, name: event.target.value })}
                                                />
                                            </Grid.Column>
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                <div className="flex justify-end" >
                                                    <button type="button" className="text-default" onClick={handleSelectPriority}>
                                                        <FlagIcon className="icon-x20" style={{ color: priorityColor }} title={priority} />
                                                    </button>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <textarea
                                                    defaultValue={task?.description || ''}
                                                    className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    placeholder="Write something about this task..."
                                                    rows={5}
                                                    onChange={(event) => setTask({ ...task, description: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <PopoverColor color={task?.color} onClick={handleColorChange} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <ProgressBarTask progress={task.progress ?? 0} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <label htmlFor="name" className="label text-2xl mt-3">{'TO DO'}</label>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <label htmlFor="name" className="label text-lg">{'SubTask'}</label>
                                                <div className="grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">
                                                    {task.subTasks && (
                                                        task.subTasks.map((subTask: SubTask, index: number) => (
                                                            <React.Fragment key={index}>
                                                                <Grid column={12} gap={1}>
                                                                    <Grid.Column sm={9} md={9} lg={9} xl={9} xxl={9} className="flex  justify-items-start mb-3">
                                                                        <input
                                                                            id="status"
                                                                            type="checkbox"
                                                                            maxLength={32}
                                                                            title="Check to confirm that the job was successful."
                                                                            checked={subTask.status === 'COMPLETED' ? true : false}
                                                                            className="w-5 bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus.border-blue-300 me-3"
                                                                            autoComplete="off"
                                                                            onChange={(event) => void handleCheckboxChange(event, subTask.id!)}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="text-lg text-default hover:text-blue-500"
                                                                            onClick={() => {
                                                                                dispatch(setOpenFormTaskDetail(false));
                                                                                dispatch(setOpenFormSubTaskDetail(true));
                                                                                setSubTaskId(subTask.id!);
                                                                            }}
                                                                        >
                                                                            {subTask.name}
                                                                        </button>
                                                                    </Grid.Column>
                                                                    <Grid.Column sm={3} md={3} lg={3} xl={3} xxl={3} className="flex  justify-items-start mb-3 pt-1">
                                                                        {subTask.assignee && (
                                                                            <React.Fragment>
                                                                                <span
                                                                                    className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-yellow-500 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-50 font-bold"
                                                                                    title={subTask.assignee?.fullName}
                                                                                >
                                                                                    {subTask.assignee?.fullName?.toUpperCase().charAt(0)}
                                                                                </span>
                                                                                <p className="p-1">{subTask.assignee.fullName?.toUpperCase()}</p>
                                                                            </React.Fragment>
                                                                        )}
                                                                    </Grid.Column>
                                                                </Grid>
                                                            </React.Fragment>
                                                        ))
                                                    )}
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center hover:text-pink-500 text-sm"
                                                    onClick={() => {
                                                        dispatch(setTaskId(taskId));
                                                        dispatch(setOpenFormTaskDetail(false));
                                                        dispatch(setOpenFormNewSubTask(true));
                                                    }}
                                                >
                                                    <HeroIcons.ClipboardDocumentListIcon className="icon-x16" />{'Add Subtask'}
                                                </button>
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
            <FormNewSubTask taskId={taskId} fetchingData={fetchTask} />
            <FormSubTaskDetail subTaskId={subTaskId} fetchingData={fetchTask} />
        </React.Fragment >
    );

};

export default Component;