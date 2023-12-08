import { Dialog, Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Priority } from '../../enum/Priority';
import { setOpenFormNewSubTask, setOpenFormSubTaskDetail, setOpenFormTaskDetail } from '../../redux/Dialog/actions';
import { getOpenFormTaskDetail } from '../../redux/Dialog/selectors';
import { setSubtaskId } from '../../redux/Subtask/actions';
import { setTaskId } from '../../redux/Task/actions';
import { getTaskId } from '../../redux/Task/selectors';
import { Grid } from '../Grid';
import { MenuPriority } from '../Menu';
import { PopoverAssignee, PopoverColor } from '../Popover';
import { ProgressBarTask } from '../ProgressBar';
import { FormNewSubTask, FormSubTaskDetail } from './index';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';

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
    tags: [],
    subTasks: []
};

const initialDateState: DateValueType = {
    startDate: null,
    endDate: null
};

const Component = ({ fetchTaskList }: Props) => {

    const dispatch = useDispatch();
    const taskId = useSelector(getTaskId);
    const isOpen = useSelector(getOpenFormTaskDetail);

    const { spaceId } = useParams();
    const [userList, setUserList] = React.useState<User[]>([]);
    const [task, setTask] = React.useState<Task>(initialTaskState);
    const [subTask, setSubTask] = React.useState<Subtask[]>([]);
    const [priority, setPriority] = React.useState(Priority.LOW);
    const [isOpenSubTask, setIsOpenSubTask] = React.useState(false);
    const [date, setDate] = React.useState<DateValueType>(initialDateState);
    const [edit, setEdit] = React.useState<boolean>(false);

    function closeModal() {
        setIsOpenSubTask(false);
    }

    function openModal() {
        setIsOpenSubTask(true);
    }
    const fetchTask = async () => {
        try {
            const response: AxiosResponse<Task> = await axios.get(`${SERVER.API.TASK}/${taskId!}`);
            setTask(response.data);
            setSubTask(response.data.subTasks!);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchUser = async () => {
        try {
            const response: AxiosResponse<User[]> = await axios.get(`${SERVER.API.USER}/all-by-space/${spaceId!}`);
            setUserList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleChangeStatusSubTask = async (id: number, status: string) => {
        try {
            await axios.patch(`${SERVER.API.SUBTASK}/change-status/${id}`, { status });
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        try {
            const isChecked = event.target.checked;
            const newStatus = isChecked ? 'COMPLETED' : 'WAITING';
            await handleChangeStatusSubTask(id, newStatus);
            await fetchTaskList();
            await fetchTask();
        } catch (error) {
            openModal();
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
            await axios.post(`${SERVER.API.TASK}/assignee/${taskId!}/${id!}`, null);
            await fetchTask();
            await fetchTaskList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleUnassigned = async (id: number | null) => {
        try {
            if (id !== null) {
                await axios.delete(`${SERVER.API.TASK}/assignee/${taskId!}/${id}`);
            }
            await fetchTask();
            await fetchTaskList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDuplicate = async () => {
        try {
            await axios.post(`${SERVER.API.TASK}/duplicate/${taskId!}`, null);
            handleClose();
            await fetchTaskList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${SERVER.API.TASK}/${taskId!}`);
            handleClose();
            await fetchTaskList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleChangePriority = async (priority?: Priority) => {
        try {
            await axios.patch(`${SERVER.API.TASK}/change-priority/${taskId!}`, { priority });
            await fetchTask();
            await fetchTaskList();
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.put(`${SERVER.API.TASK}/${taskId!}`, task);
        } catch (error) {
            throw new Error(error as string);
        } finally {
            handleClose();
        }
    };

    const handleClose = () => {
        void fetchTaskList();
        void fetchTask();
        dispatch(setTaskId(null));
        setTask(initialTaskState);
        setUserList([]);
        setEdit(false);
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

    React.useEffect(() => {
        setTask((prevState) => ({
            ...prevState,
            priority,
            start: date?.startDate as Date,
            end: date?.endDate as Date,
        }));
    }, [priority, date]);

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
                                <Dialog.Panel className="w-full max-w-2xl p-6 text-left align-middle transition-all transform rounded-lg shadow-lg bg-default text-default">
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                <div className="flex my-2">
                                                    {edit && (
                                                        <div className="inline-flex items-center w-full">
                                                            <Datepicker
                                                                value={date}
                                                                onChange={setDate}
                                                                primaryColor={'pink'}
                                                                showShortcuts={true}
                                                                showFooter={true}
                                                                displayFormat={'DD/MM/YYYY'}
                                                                inputClassName="inline-block pt-5 pb-3 w-full bg-default outline-none text-default border-b border-transparent text-xs cursor-pointer"
                                                                popoverDirection="down"
                                                                useRange={false}
                                                                // i18n={'en'}
                                                                configs={{
                                                                    shortcuts: {
                                                                        today: 'Today',
                                                                        weekDa: {
                                                                            text: 'Week',
                                                                            period: {
                                                                                start: new Date().toDateString(),
                                                                                end: (() => {
                                                                                    const endDate = new Date();
                                                                                    endDate.setDate(endDate.getDate() + 7);
                                                                                    return endDate.toDateString();
                                                                                })(),
                                                                            },
                                                                        },
                                                                        currentMonth: 'This Month',
                                                                    },
                                                                    // footer: {
                                                                    //     cancel: 'CText',
                                                                    //     apply: 'AText'
                                                                    // }
                                                                }}
                                                                readOnly={false}
                                                            />
                                                            <HeroIcons.CheckIcon className="cursor-pointer icon-x16 hover:text-green-500" onClick={() => setEdit(false)} />
                                                        </div>
                                                    )}
                                                    {!edit && (
                                                        <React.Fragment>
                                                            <p className="inline-flex items-center py-2 text-xs text-default">
                                                                <HeroIcons.CalendarDaysIcon className="icon-x16" onClick={() => setEdit(true)} />
                                                                {task?.start && (
                                                                    new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.start))
                                                                )}
                                                            </p>
                                                            <p className="inline-flex items-center px-2 py-2 text-xs text-default">
                                                                {'—'}
                                                            </p>
                                                            <p className="inline-flex items-center py-2 text-xs text-default">
                                                                {task?.end && (
                                                                    new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.end))
                                                                )}
                                                            </p>
                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                <div className="flex justify-end">
                                                    <div className="flex justify-end has-tooltip">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-2 py-2 text-sm border rounded-l-lg text-default bg-default-faded border-default hover:bg-default"
                                                            onClick={() => void handleDuplicate()}>
                                                            <HeroIcons.Square2StackIcon className="mr-0 icon-x16" />
                                                        </button>
                                                        <span className="mt-12 tooltip">{'Duplicate'}</span>
                                                    </div>
                                                    <div className="flex justify-end has-tooltip">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-2 py-2 text-sm text-red-500 border bg-default-faded border-default rounded-r-md hover:bg-default"
                                                            onClick={() => void handleDelete()}
                                                        >
                                                            <HeroIcons.TrashIcon className="mr-0 icon-x16" />
                                                        </button>
                                                        <span className="mt-12 tooltip">{'Delete'}</span>
                                                    </div>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                <div className="text-left">
                                                    <Menu as="div" className="relative inline-block text-left">
                                                        <div className="flex justify-end has-tooltip">
                                                            <Menu.Button className="flex items-center">
                                                                <HeroIcons.UserPlusIcon className="mt-2 icon-x20" />
                                                            </Menu.Button>
                                                            <span className="mt-10 tooltip">{'Assignee'}</span>
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
                                                                <div className="px-1 py-1 overflow-y-scroll max-h-40">
                                                                    {Array.isArray(userList) && userList.map((user: User, index: number) => (
                                                                        <Menu.Item key={index}>
                                                                            <div
                                                                                className="flex items-center w-full px-2 py-2 text-sm rounded-md cursor-pointer group text-default hover:bg-default-faded"
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
                                                <PopoverAssignee assignee={task.assignee} handleUnassigned={handleUnassigned} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10}>
                                                <input
                                                    type="text"
                                                    maxLength={255}
                                                    value={task?.name || ''}
                                                    className="flex w-full py-2 text-xl bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => setTask({ ...task, name: event.target.value })}
                                                />
                                            </Grid.Column>
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                <MenuPriority priority={task.priority as Priority} setPriority={setPriority} handleChangePriority={handleChangePriority} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <textarea
                                                    value={task?.description || ''}
                                                    className="flex w-full py-2 bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
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
                                        <Grid column={12} gap={1} className="my-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center text-sm hover:text-pink-500"
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
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12} className="px-5 max-h-72">
                                                {subTask && (
                                                    subTask.sort((a, b) => a.id! - b.id!).map((subTask: Subtask, index: number) => (
                                                        <React.Fragment key={index}>
                                                            <Grid column={12} gap={1}>
                                                                <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                                    <ol className="relative border-l border-default">
                                                                        <li className="mb-5 ml-4">
                                                                            <div className="has-tooltip">
                                                                                <input
                                                                                    id={`checkbox-${subTask.id!}`}
                                                                                    type="checkbox"
                                                                                    maxLength={32}
                                                                                    checked={subTask.status === 'COMPLETED' ? true : false}
                                                                                    className="hidden"
                                                                                    onChange={(event) => void handleCheckboxChange(event, subTask.id!)}
                                                                                />
                                                                                <label
                                                                                    htmlFor={`checkbox-${subTask.id!}`}
                                                                                    className={`absolute w-3 h-3 ${subTask.status === 'COMPLETED' ? 'bg-green-400' : 'bg-default-faded'} rounded-full mt-1.5 -left-1.5 border border-default cursor-pointer select-none`}
                                                                                />
                                                                                <span className="tooltip">{'Check to confirm that the job was successful.'}</span>
                                                                            </div>
                                                                            <time className="mb-1 text-xs leading-none text-default">{new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(task.end!))}</time>
                                                                            <div className="has-tooltip">
                                                                                <h3
                                                                                    className="overflow-hidden truncate cursor-pointer text-md text-default hover:text-pink-400"
                                                                                    onClick={() => {
                                                                                        dispatch(setOpenFormTaskDetail(false));
                                                                                        dispatch(setOpenFormSubTaskDetail(true));
                                                                                        dispatch(setSubtaskId(subTask.id!));
                                                                                    }}
                                                                                >
                                                                                    {subTask.name}

                                                                                </h3>
                                                                                <span className="tooltip max-w-[width]">{subTask.name}</span>
                                                                            </div>
                                                                        </li>
                                                                    </ol>
                                                                </Grid.Column>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))
                                                )}
                                                <Transition appear show={isOpenSubTask} as={React.Fragment}>
                                                    <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                                                    <Dialog.Panel className="max-w-2xl p-6 font-bold text-center align-middle transition-all transform rounded-lg shadow-lg w-30 bg-default text-default">
                                                                        <div className="alert">
                                                                            {'This Subtask is Not Assigned to You !!!'}
                                                                        </div>
                                                                    </Dialog.Panel>
                                                                </Transition.Child>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </Transition>
                                            </Grid.Column>
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
            <FormNewSubTask taskId={taskId} fetchingData={fetchTask} />
            <FormSubTaskDetail fetchingData={fetchTask} />
        </React.Fragment>
    );

};

export default Component;