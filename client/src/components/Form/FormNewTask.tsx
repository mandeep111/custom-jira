import { Dialog, Menu, Transition } from '@headlessui/react';
import * as HeroIcons from '@heroicons/react/24/outline';
import { FlagIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { toast } from 'react-toastify';
import { Priority } from '../../enum/Priority';
import { setOpenFormNewTask } from '../../redux/Dialog/actions';
import { getOpenFormNewTask } from '../../redux/Dialog/selectors';
import Http from '../../services/Http';
import { Assign } from '../../types/Assign';
import { Task } from '../../types/Task';
import { User } from '../../types/User';
import { API } from '../../utils/api';
import { Grid } from '../Grid';
import { PopoverColor } from '../Popover';

interface Props {
    fetchingData: () => Promise<void>;
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

const initialDateState: DateValueType = {
    startDate: null,
    endDate: null
};

const Component = ({ fetchingData }: Props) => {

    const { projectId, spaceId } = useParams();

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormNewTask);

    const [userList, setUserList] = React.useState<User[]>([]);
    const [assign, setAssign] = React.useState<Assign[]>([]);
    const [priority, setPriority] = React.useState(Priority.LOW);
    const [priorityColor, setPriorityColor] = React.useState('#27AE60');
    const [date, setDate] = React.useState<DateValueType>(initialDateState);

    const [task, setTask] = React.useState<Task>(initialTaskState);

    const fetchUserList = async () => {
        try {
            const response: User[] = await Http.getById(`${API.USER}/all-by-space/${spaceId!}`);
            setUserList(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleClose = () => {
        setTask(initialTaskState);
        setAssign([]);
        setDate(initialDateState);
        dispatch(setOpenFormNewTask(false));
    };

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setTask((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleAssignClick = (id: number | null) => {
        const existingIndex = assign.findIndex((item) => item.id === id);
        if (existingIndex !== -1) {
            const newAssign = [...assign.slice(0, existingIndex), ...assign.slice(existingIndex + 1)];
            setAssign(newAssign);
        } else {
            setAssign([...assign, { id, fullName: userList.find((item) => item.id === id)!.fullName }]);
        }
    };

    const handleSelectPriority = () => {
        const priorityArray = Object.values(Priority);
        const currentIndex = priorityArray.indexOf(priority);
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
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await Http.create(API.TASK, task);
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        } finally {
            handleClose();
        }
    };

    React.useEffect(() => {
        void fetchUserList();
        setTask((prevState) => ({
            ...prevState,
            projectId: parseInt(projectId!),
            priority,
            assignee: assign,
            start: date?.startDate as Date,
            end: date?.endDate as Date,
        }));
    }, [assign, priority, projectId, date]);

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
                                <Dialog.Panel className="w-full transform rounded-lg bg-default p-6 text-left align-middle shadow-lg transition-all text-default max-w-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 text-default mb-2 font-bold"
                                    >
                                        {'Create new Task'}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={handleClose}
                                        >
                                            <HeroIcons.XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <div className="flex justify-between">
                                                    <PopoverColor color={task.color} onClick={handleColorChange} />
                                                    <button type="button" className="text-default" onClick={handleSelectPriority}>
                                                        <FlagIcon className="icon-x20" style={{ color: priorityColor }} title={priority} />
                                                    </button>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={6} md={6} lg={6} xl={6} xxl={6}>
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
                                                    readOnly
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input
                                                    type="text"
                                                    maxLength={32}
                                                    value={task.name || ''}
                                                    placeholder="Task name"
                                                    className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => setTask({ ...task, name: event.target.value })}
                                                    required
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={12}>
                                            <Grid.Column sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                <Menu as="div" className="relative inline-block text-left">
                                                    <div>
                                                        <Menu.Button className="flex items-center">
                                                            <HeroIcons.UserPlusIcon className="icon-x20 mt-5" fill="transparent" />
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
                                                                    {userList.map((data, index) => (
                                                                        <Menu.Item key={index}>
                                                                            {() => (
                                                                                <React.Fragment>
                                                                                    <div
                                                                                        className="group text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer"
                                                                                        onClick={() => handleAssignClick(data.id)}
                                                                                    >
                                                                                        {data.fullName}
                                                                                    </div>
                                                                                </React.Fragment>
                                                                            )}
                                                                        </Menu.Item>
                                                                    ))}
                                                                </React.Fragment>
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu >
                                            </Grid.Column>
                                            <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10} className="flex justify-end">
                                                <div className="flex mt-2 -space-x-3">
                                                    {assign.slice(0, 5).map((data, index) => (
                                                        <span
                                                            key={index}
                                                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-zinc-400 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-100 font-bold"
                                                            title={data.fullName}
                                                        >
                                                            {data.fullName?.toUpperCase().charAt(0)}
                                                        </span>
                                                    ))}
                                                    {assign.length > 5 && (
                                                        <span
                                                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-indigo-400 border border-indigo-300 align-middle items-center flex text-center justify-center text-indigo-100 font-bold"
                                                            title={assign.slice(5).map((item) => item.fullName).join(', ')}
                                                        >
                                                            {'+'}{assign.length - 5}
                                                        </span>
                                                    )}
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <textarea
                                                    value={task.description || ''}
                                                    className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    placeholder="Write something about this task..."
                                                    rows={5}
                                                    onChange={(event) => setTask({ ...task, description: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="button w-full bg-pink-400 hover:bg-pink-500 focus:bg-pink-500 text-white">{'Create'}</button>
                                            </Grid.Column>
                                        </Grid>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </React.Fragment>
    );
};

export default Component;