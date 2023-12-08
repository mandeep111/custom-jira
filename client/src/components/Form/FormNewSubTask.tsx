import { Dialog, Menu, Transition } from '@headlessui/react';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { toast } from 'react-toastify';
import { Priority } from '../../enum/Priority';
import { Status } from '../../enum/Status';
import { setOpenFormNewSubTask } from '../../redux/Dialog/actions';
import { getOpenFormNewSubTask } from '../../redux/Dialog/selectors';
import { setTaskId } from '../../redux/Task/actions';
import { ComboboxSubtask } from '../Combobox';
import { Grid } from '../Grid';
import { ListboxForm } from '../Listbox';
import { PopoverColor } from '../Popover';

interface Props {
    taskId: number | null;
    fetchingData: () => Promise<void>;
}

const initialSubtaskState: Subtask = {
    taskId: null,
    name: '',
    description: '',
    color: '#FCA5A5',
    status: Status.WAITING,
    priority: Priority.LOW,
    needApproval: false,
    requestCode: '',
    formId: null,
    start: null,
    end: null,
    assigneeId: null,
    isBlocked: false,
    blockedBy: null,
};

const initialDateState: DateValueType = {
    startDate: null,
    endDate: null
};

const Component = ({ taskId, fetchingData }: Props) => {

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormNewSubTask);

    const [form, setForm] = React.useState<number | null>(null);
    const [userList, setUserList] = React.useState<User[]>();
    const [assign, setAssign] = React.useState<Assign>();
    const [subtask, setSubtask] = React.useState<Subtask>(initialSubtaskState);
    const [subTaskList, setSubTaskList] = React.useState<Subtask[]>([]);
    const [date, setDate] = React.useState<DateValueType>(initialDateState);
    const [isBlocked, setIsBlocked] = React.useState<boolean>(false);
    const [blockedBy, setBlockedBy] = React.useState<number | null>(null);

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setSubtask((prevState) => ({
            ...prevState,
            color: target.value
        }));
    };

    const handleAssignClick = (id: number | null, name: string) => {
        setAssign((prevState) => ({
            ...prevState,
            id: id,
            fullName: name
        }));
    };

    const fetchSubTaskList = async () => {
        try {
            const response: AxiosResponse<Task> = await axios.get(`${SERVER.API.TASK}/${taskId!}`);
            setSubTaskList(response.data.subTasks!);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const fetchUser = async () => {
        try {
            const response: AxiosResponse<User[]> = await axios.get(`${SERVER.API.USER}/all-by-task/${taskId!}`);
            setUserList(response.data);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleClose = () => {
        dispatch(setTaskId(null));
        setSubtask(initialSubtaskState);
        setDate(initialDateState);
        setAssign(undefined);
        setBlockedBy(null);
        setIsBlocked(false);
        dispatch(setOpenFormNewSubTask(false));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (date === null || date.startDate === null || date.endDate === null) {
            toast.error('Please select date');
            return;
        }
        if (subtask.assigneeId === null) {
            toast.error('Please select assignee');
            return;
        }
        try {
            await axios.post(SERVER.API.SUBTASK, subtask);
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        }
        finally {
            handleClose();
            void fetchingData();
        }
    };

    React.useEffect(() => {
        if (taskId) {
            void fetchUser();
            void fetchSubTaskList();
        }
    }, [taskId]);

    React.useEffect(() => {
        setSubtask((prevState) => ({
            ...prevState,
            formId: Number(form)
        }));
    }, [form]);

    React.useEffect(() => {
        setSubtask((prevState) => ({
            ...prevState,
            taskId,
            isBlocked,
            blockedBy,
            start: date?.startDate as Date,
            end: date?.endDate as Date,
        }));
    }, [taskId, date, isBlocked, blockedBy]);

    React.useEffect(() => {
        assign && setSubtask((prevState) => ({
            ...prevState,
            assigneeId: assign.id!
        }));
    }, [assign]);

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
                                    <Dialog.Title
                                        as="h3"
                                        className="mb-2 text-lg font-bold leading-6 text-default"
                                    >
                                        {'Create New Subtask'}
                                        <button
                                            type="button"
                                            className="float-right text-default"
                                            onClick={handleClose}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <div className="flex justify-between">
                                                    <PopoverColor color={subtask.color} onClick={handleColorChange} />
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
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input
                                                    type="text"
                                                    maxLength={255}
                                                    value={subtask.name || ''}
                                                    placeholder="SubTask Name"
                                                    className="flex w-full py-2 text-xl bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => setSubtask({ ...subtask, name: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-3">
                                            <Grid.Column sm={10} md={10} lg={10} xl={10} xxl={10} className="flex">
                                                <div className="w-72 bg-default">
                                                    <Menu as="div" className="relative inline-block text-left">
                                                        <div>
                                                            <Menu.Button className="flex items-center">
                                                                <UserPlusIcon className="mt-2 icon-x20" fill="transparent" />
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
                                                                <div className="px-1 py-1 overflow-y-scroll max-h-40">
                                                                    <React.Fragment>
                                                                        {Array.isArray(userList) && userList.map((user: User, index: number) => (
                                                                            <Menu.Item key={index}>
                                                                                <React.Fragment>
                                                                                    <div
                                                                                        className="flex items-center w-full px-2 py-2 text-sm rounded-md cursor-pointer group text-default hover:bg-default-faded"
                                                                                        onClick={() => handleAssignClick(user.id, user.fullName)}
                                                                                    >
                                                                                        {user.fullName}
                                                                                    </div>
                                                                                </React.Fragment>
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
                                                {assign && (
                                                    <div className="flex overflow-hidden justify-items-start whitespace-nowrap">
                                                        <span
                                                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-orange-600 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-50 font-bold"
                                                            title={assign.fullName}
                                                        >
                                                            {assign.fullName.toUpperCase().charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <textarea
                                                    id="description"
                                                    value={subtask.description || ''}
                                                    className="flex w-full py-2 bg-transparent border-b border-transparent outline-none text-default hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    placeholder="Write something about this Subtask..."
                                                    rows={5}
                                                    onChange={(event) => setSubtask({ ...subtask, description: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="flex items-center mt-5">
                                            <Grid.Column sm={4} md={4} lg={4} xl={4} xxl={4}>
                                                <div className="checkbox-group">
                                                    <input
                                                        id="isFirst"
                                                        type="checkbox"
                                                        checked={isBlocked ? true : false}
                                                        onChange={(event) => setIsBlocked(event.target.checked)}
                                                    />
                                                    <label htmlFor="isFirst" className="inline-flex ml-1 cursor-pointer label">{'Do it first.'}</label>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column sm={8} md={8} lg={8} xl={8} xxl={8}>
                                                {isBlocked && (
                                                    <ComboboxSubtask subTaskList={subTaskList} setBlockedBy={setBlockedBy} />
                                                )}
                                            </Grid.Column>
                                        </Grid>
                                        {WORKFLOW_ENABLED && (
                                            <Grid column={12} gap={1} className="mt-5 text-center">
                                                <Grid.Column sm={8} md={8} lg={8} xl={8} xxl={8}>
                                                    <ListboxForm setForm={setForm} />
                                                </Grid.Column>
                                                <Grid.Column sm={4} md={4} lg={4} xl={4} xxl={4}>
                                                    <div className="checkbox-group">
                                                        <input
                                                            id="needApproval"
                                                            type="checkbox"
                                                            checked={subtask.needApproval}
                                                            onChange={(event) => setSubtask({ ...subtask, needApproval: event.target.checked })}
                                                        />
                                                        <label htmlFor="needApproval" className="inline-flex ml-1 cursor-pointer label">{'Need Approval'}</label>
                                                    </div>
                                                </Grid.Column>
                                            </Grid>
                                        )}
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <button type="submit" className="w-full text-white bg-pink-400 button hover:bg-pink-500 focus:bg-pink-500">{'Create'}</button>
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