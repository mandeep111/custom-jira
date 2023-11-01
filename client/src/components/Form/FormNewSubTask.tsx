import { Dialog, Menu, Transition } from '@headlessui/react';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Priority } from '../../enum/Priority';
import { Status } from '../../enum/Status';
import { setOpenFormNewSubTask } from '../../redux/Dialog/actions';
import { getOpenFormNewSubTask } from '../../redux/Dialog/selectors';
import { setTaskId } from '../../redux/Task/actions';
import Http from '../../services/Http';
import { Assign } from '../../types/Assign';
import { SubTask } from '../../types/SubTask';
import { User } from '../../types/User';
import { API } from '../../utils/api';
import { Grid } from '../Grid';
import { ListboxForm } from '../Listbox';
import { PopoverColor } from '../Popover';

interface Props {
    taskId: number | null;
    fetchingData: () => Promise<void>;
}

const initialSubTaskState: SubTask = {
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
    assigneeId: null
};

const Component = ({ taskId, fetchingData }: Props) => {

    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFormNewSubTask);

    const [form, setForm] = React.useState<number | null>(null);
    const [userList, setUserList] = React.useState<User[]>();
    const [isCheckUser, setIsCheckUser] = React.useState<boolean>(false);
    const [assign, setAssign] = React.useState<Assign>();
    const [subTask, setSubTask] = React.useState<SubTask>(initialSubTaskState);

    const handleColorChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setSubTask((prevState) => ({
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

    const fetchUser = async () => {
        try {
            const response: User[] = await Http.getById(`${API.USER}/all-by-task/${taskId!}`);
            setUserList(response);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const handleClose = () => {
        dispatch(setTaskId(null));
        setSubTask(initialSubTaskState);
        dispatch(setOpenFormNewSubTask(false));
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await Http.create(API.SUBTASK, subTask);
            await fetchingData();
        } catch (error) {
            throw new Error(error as string);
        }
        finally {
            handleClose();
        }
    };

    React.useEffect(() => {
        if (isCheckUser) {
            void fetchUser();
            setIsCheckUser(false);
        }
    }, [isCheckUser]);

    React.useEffect(() => {
        setSubTask((prevState) => ({
            ...prevState,
            formId: Number(form)
        }));
    }, [form]);

    React.useEffect(() => {
        setSubTask((prevState) => ({
            ...prevState,
            taskId: taskId
        }));
    }, [taskId]);

    React.useEffect(() => {
        assign && setSubTask((prevState) => ({
            ...prevState,
            assigneeId: assign.id!
        }));
    }, [assign]);

    return (
        <React.Fragment>
            <Transition appear show={isOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => dispatch(setOpenFormNewSubTask(false))}>
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
                                        {'Create new Subtask'}
                                        <button
                                            type="button"
                                            className="text-default float-right"
                                            onClick={() => dispatch(setOpenFormNewSubTask(false))}
                                        >
                                            <XMarkIcon className="icon-x16" />
                                        </button>
                                        <hr className="mt-5" />
                                    </Dialog.Title>
                                    <form onSubmit={(event) => void handleFormSubmit(event)}>
                                        <Grid column={12} gap={1}>
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <PopoverColor color={subTask.color} onChange={handleColorChange} />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5">
                                            <Grid.Column sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input
                                                    type="text"
                                                    maxLength={32}
                                                    value={subTask.name || ''}
                                                    placeholder="Task name"
                                                    className="flex w-full bg-transparent text-xl outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    autoComplete="off"
                                                    onChange={(event) => setSubTask({ ...subTask, name: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
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
                                                                                <React.Fragment>
                                                                                    <div
                                                                                        className="group text-default flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-default-faded cursor-pointer"
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
                                                    <div className="flex grid-cols-1  justify-items-start  whitespace-nowrap overflow-hidden">
                                                        <span
                                                            className="w-7 h-7 px-2.5 py-1.5 text-xs rounded-full bg-yellow-500 border border-zinc-300 align-middle items-center flex text-center justify-center text-zinc-50 font-bold"
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
                                                    value={subTask.description || ''}
                                                    className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    placeholder="Write something about this task..."
                                                    rows={5}
                                                    onChange={(event) => setSubTask({ ...subTask, description: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1}>
                                                <label htmlFor="start" className="label mt-2.5">{'Start'}</label>
                                            </Grid.Column>
                                            <Grid.Column sm={5} md={5} lg={5} xl={5} xxl={5}>
                                                <input
                                                    type="date"
                                                    value={subTask.start ? new Date(subTask.start).toISOString().substr(0, 10) : ''}
                                                    className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    onChange={(event) => setSubTask({ ...subTask, start: event.target.value })}
                                                />
                                            </Grid.Column>
                                            <Grid.Column sm={1} md={1} lg={1} xl={1} xxl={1}>
                                                <label htmlFor="start" className="label mt-2.5">{'End'}</label>
                                            </Grid.Column>
                                            <Grid.Column sm={5} md={5} lg={5} xl={5} xxl={5}>
                                                <input
                                                    type="date"
                                                    value={subTask.end ? new Date(subTask.end).toISOString().substr(0, 10) : ''}
                                                    className="flex w-full bg-transparent outline-none text-default border-b border-transparent py-2 hover:border-b hover:border-default focus:border-b focus:border-blue-300"
                                                    onChange={(event) => setSubTask({ ...subTask, end: event.target.value })}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                        <Grid column={12} gap={1} className="mt-5 text-center">
                                            <Grid.Column sm={8} md={8} lg={8} xl={8} xxl={8}>
                                                <ListboxForm setForm={setForm} />
                                            </Grid.Column>
                                            <Grid.Column sm={4} md={4} lg={4} xl={4} xxl={4}>
                                                <div className="checkbox-group">
                                                    <input
                                                        id="needApproval"
                                                        type="checkbox"
                                                        checked={subTask.needApproval}
                                                        onChange={(event) => setSubTask({ ...subTask, needApproval: event.target.checked })}
                                                    />
                                                    <label htmlFor="needApproval" className="label cursor-pointer inline-flex ml-1">{'Need Approval'}</label>
                                                </div>
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